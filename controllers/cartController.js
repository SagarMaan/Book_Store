const { isValidObjectId } = require("mongoose");

const bookModel = require("../models/bookModel");
const cartModel = require("../models/cartModel")



class CartController {

    constructor() {
    }

    //=====================================                   ==============================================//
    //                                         Create  Cart                                                 //
    //=====================================                  ==============================================//


    async createCart(req, res) {

        try {

            let userId = req.userId;

            let body = req.body;

            let { books } = body

            if (Object.keys(body).length == 0) {
                return res.status(400).send({ status: false, message: " Body can not be empty. " });
            }

            if (!books) {
                return res.status(400).send({ status: false, message: " Please provide bookId. " });
            }

            let { bookId, quantity } = books

            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, message: " Please provide a Valid product Id. " });
            }

            let checkBookExist = await bookModel.findById({ _id: bookId, isDeleted: false, });

            if (!checkBookExist) {
                return res.status(400).send({ status: false, message: " Book does not  Exists of this Id. " });
            }

            if (!quantity) {
                return res.status(400).send({ status: false, message: " Please provide number of books you add to cart. " });
            }


            let checkCartExist = await cartModel.findOne({ userId: userId });

            // first we are finding that this user have their cart or not

            if (!checkCartExist) { //if he had not a cart then firstly we define a schema and then create a cart for him

                let addNewCart = {

                    userId: userId,
                    books:
                    {
                        bookId: bookId,
                        quantity: quantity
                    },
                    totalBooks: 1,
                    totalPrice: checkBookExist.price * quantity,
                };

                let createCart = await cartModel.create(addNewCart);

                return res.status(201).send({ status: true, message: " Cart created successfully. ", data: createCart });

            } else {

                let cartId = checkCartExist._id

                for (let i = 0; i < checkCartExist.books.length; i++) {

                    if (checkCartExist.books[i].bookId == bookId) {

                        checkCartExist.books[i].quantity = checkCartExist.books[i].quantity + parseInt(quantity);

                        checkCartExist.totalPrice = checkCartExist.totalPrice + quantity * checkBookExist.price;

                        checkCartExist.save();

                        return res.status(201).send({ status: true, message: " Add the data successffuly in your cart. ", data: checkCartExist });
                    }
                }

                let books = { bookId: bookId, quantity: quantity };

                let totalPrice = checkCartExist.totalPrice + quantity * checkBookExist.price;

                let updateCartItems = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { totalPrice: totalPrice }, $push: { books: books }, $inc: { totalBooks: 1 } }, { new: true });

                return res.status(201).send({ status: true, message: " Add the data successffuly in your cart. ", data: updateCartItems });

            }

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }


    //=====================================                   ==============================================//
    //                                         Get  Cart                                                   //
    //=====================================                  ==============================================//


    async getCart(req, res) {

        try {

            let userId = req.userId

            let getCartData = await cartModel.findOne({ userId: userId });

            if (!getCartData) {
                return res.status(403).send({ status: false, message: " Cart not found with this userId. " });
            }

            if (getCartData.books.length == 0) {
                return res.status(403).send({ status: false, message: " Books not found or it may be deleted. " });
            }

            return res.status(403).send({ status: true, message: " Get the cart details successfully. ", data: getCartData });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }


    //=====================================                   ==============================================//
    //                                        Update  Cart                                                 //
    //=====================================                  ==============================================//



    async updateCart(req, res) {

        try {

            let userId = req.userId

            let cartId = req.params.cartId

            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: " Given cartId is invalid. " })
            }

            let verifyCartId = await cartModel.findById(cartId)

            if (!verifyCartId) {
                return res.status(400).send({ status: false, message: " Given cartId is not present in your database. " })
            }

            if (userId != verifyCartId.userId) {
                return res.status(403).send({ status: false, message: " You are not authorized to do this action. " })
            }

            let body = req.body

            let { books } = body

            let { bookId, quantity } = books

            if (!bookId) {
                return res.status(400).send({ status: false, message: " Please provide bookId for update the values. " })
            }

            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, message: " Given bookId is invalid. " })
            }

            let verifyBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })

            if (!verifyBookId) {
                return res.status(400).send({ status: false, message: " Given bookId is not present in your database it might be deleted. " })
            }

            if (!quantity) {
                return res.status(400).send({ status: false, message: " Please provide quantity for updation. " })
            }


            for (let i = 0; i < verifyCartId.books.length; i++) {

                if (verifyCartId.books[i].bookId == bookId) {

                    if (verifyCartId.books[i].quantity < quantity) {
                        verifyCartId.books[i].quantity = (quantity - verifyCartId.books[i].quantity);
                        verifyCartId.totalPrice = verifyCartId.totalPrice + verifyCartId.books[i].quantity * verifyBookId.price

                        verifyCartId.save();

                        return res.status(200).send({ status: true, message: " Cart data updated successfully. ", data: verifyCartId });

                    } else {

                        verifyCartId.books[i].quantity = verifyCartId.books[i].quantity - quantity;
                        verifyCartId.totalPrice = verifyCartId.totalPrice - verifyCartId.books[i].quantity * verifyBookId.price;

                        verifyCartId.save();

                        return res.status(200).send({ status: true, message: " Cart data updated successfully. ", data: verifyCartId });
                    }
                }
            }
        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }


    //=====================================                   ==============================================//
    //                                        Clear  Cart                                                  //
    //=====================================                  ==============================================//


    async clearCart(req, res) {

        try {
            // kya sirf userId se cart id ko find krke uska data clear krna h ya user Id k saat uss user Id se bni CartId ko leke or verify krke tab cartId ka data clear krna h 
            let userId = req.userId

            let clearCart = await cartModel.findOneAndUpdate({ userId: userId }, { $set: { books: [], totalPrice: 0, totalBooks: 0 } }, { new: true });

            if (!clearCart) {
                return res.status(404).send({ status: false, message: " Cart does not exit in with this userId. " });
            }

            return res.status(200).send({ status: true, message: " Clear cart details successfully. " });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }
}


module.exports = CartController
