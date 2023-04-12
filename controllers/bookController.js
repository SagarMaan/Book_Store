const { isValidObjectId } = require("mongoose");

const { validateName, validatePrice } = require("../validators/validator")


const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel")



class BookController {

    constructor() {
    }

    //=====================================                   ==============================================//
    //                                         Create  Book                                                 //
    //=====================================                  ==============================================//


    async createBook(req, res) {

        try {

            let userId = req.userId;

            let body = req.body;

            let { bookName, authorName, category, price } = body;

            if (Object.keys(body).length == 0) {
                return res.status(400).send({ status: false, message: " Body can not be empty. " });
            }

            if (bookName && typeof bookName != "string") {
                return res.status(400).send({ status: false, message: " Book name must be in string. " });
            }

            if (!bookName || !bookName.trim()) {
                return res.status(400).send({ status: false, message: " Book name must be present in body and can't be empty. " });
            }

            bookName = bookName.toLowerCase().trim();

            if (authorName && typeof authorName != "string") {
                return res.status(400).send({ status: false, message: " Author name must be in string. " });
            }

            if (!authorName || !authorName.trim()) {
                return res.status(400).send({ status: false, message: " Author name must be present in body and can't be empty. " });
            }

            authorName = authorName.trim();

            if (!price) {
                return res.status(400).send({ status: false, message: " Price must be present in body and it can't be empty. " });
            }

            if (price && typeof price != "number") {
                return res.status(400).send({ status: false, message: " Price must be in number. " });
            }

            if (!validatePrice(price)) {
                return res.status(400).send({ status: false, message: "  Price shuld be in digits only. " });
            }

            if (category && typeof category != "string") {
                return res.status(400).send({ status: false, message: " Category must be in string. " });
            }

            if (!category || !category.trim()) {
                return res.status(400).send({ status: false, message: " Category must be present in body and can't be empty. " });
            }

            if (!validateName(category)) {
                return res.status(400).send({ status: false, message: " Category contains only alphabates. " });
            }
            category = category.trim();

            body.userId = userId;

            const bookData = await bookModel.create(body);

            return res.status(201).send({ status: true, message: " Book created sucessfully. ", data: bookData });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message })

        }
    }


    //===================================                         ===========================================//
    //                                    Get Complete Book List                                             //
    //===================================                         ===========================================//


    async getBookList(req, res) {

        try {

            let userId = req.userId;

            const bookList = await bookModel.find({ isDeleted: false }).select({ isDeleted: 0, __v: 0, _id: 0 })

            if (bookList.length == 0) {
                return res.status(404).send({ status: false, message: " Data not found or data already deleted. " });
            }

            return res.status(200).send({ status: true, message: " Successfully get book list. ", data: bookList });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }
    // agr sirf ek hi book ki details chahiye to uske liye to book id param me deni pdegi ?


    //=====================================                   ==============================================//
    //                                         Update  Book                                                 //
    //=====================================                  ==============================================//


    async updateBook(req, res) {
        try {

            let userId = req.userId;

            let bookId = req.params.bookId;

            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, message: " Given BookID is invalid. " })
            }

            let verifyBookId = await bookModel.findById({ _id: bookId, isDeleted: false })

            if (!verifyBookId) {
                return res.status(400).send({ status: false, message: " Given BookID is not present in your database. " })
            }

            if (userId != verifyBookId.userId) {
                return res.status(403).send({ status: false, message: " You are not authorized to do this action. " })
            }

            let body = req.body;

            let { bookName, authorName, category, price } = body;

            if (Object.keys(body).length == 0) {
                return res.status(400).send({ status: false, message: " Give some inputs for update a book. " });
            }

            let updateData = {};

            if (bookName) {

                if (bookName && typeof bookName != "string") {
                    return res.status(400).send({ status: false, message: " Book name must be in string. " });
                }

                if (!bookName || !bookName.trim()) {
                    return res.status(400).send({ status: false, message: " Book name must be present in body and can't be empty. " });
                }

                bookName = bookName.toLowerCase().trim();
                updateData.bookName = bookName
            }

            if (authorName) {

                if (authorName && typeof authorName != "string") {
                    return res.status(400).send({ status: false, message: " Author name must be in string. " });
                }

                if (!authorName || !authorName.trim()) {
                    return res.status(400).send({ status: false, message: " Author name must be present in body and can't be empty. " });
                }

                if (!validateName(authorName)) {
                    return res.status(400).send({ status: false, message: " Author name contain only alphabates. " });
                }

                authorName = authorName.trim();
                updateData.authorName = authorName
            }

            if (price) {

                if (price && typeof price != "number") {
                    return res.status(400).send({ status: false, message: " Price must be in number. " });
                }

                if (!validatePrice(price)) {
                    return res.status(400).send({ status: false, message: "  Price shuld be in digits only. " });
                }

                updateData.price = price
            }

            if (category) {

                if (category && typeof category != "string") {
                    return res.status(400).send({ status: false, message: " Category must be in string. " });
                }

                if (!category || !category.trim()) {
                    return res.status(400).send({ status: false, message: " Category must be present in body and can't be empty. " });
                }

                if (!validateName(category)) {
                    return res.status(400).send({ status: false, message: " Category contains only alphabates. " });
                }

                category = category.trim();
                updateData.category = category
            }

            const updateBookDetails = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, updateData, { new: true })

            if (!updateBookDetails) {
                return res.status(404).send({ status: false, message: " No data found for updation this book may be deleted. " });
            }

            return res.status(200).send({ status: true, message: " Success", data: updateBookDetails });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }



    //=====================================                   ==============================================//
    //                                         Delete  Book                                                 //
    //=====================================                  ==============================================//



    async deleteBook(req, res) {

        try {

            let userId = req.userId;

            let BookID = req.params.bookId;

            if (!BookID) {
                return res.status(400).send({ status: false, message: " Please provide book id. " })
            }

            if (!isValidObjectId(BookID)) {
                return res.status(400).send({ status: false, message: " Given BookID is invalid. " })
            }

            let verifyBookId = await bookModel.findById({ _id: BookID, isDeleted: false })

            if (!verifyBookId) {
                return res.status(400).send({ status: false, message: " Given BookID is not present in your database. " })
            }

            if (userId != verifyBookId.userId) {
                return res.status(403).send({ status: false, message: " You are not authorized to do this action. " })
            }

            await bookModel.findOneAndUpdate({ _id: BookID, isDeleted: false }, { isDeleted: true }, { new: true })

            await reviewModel.updateMany({ bookId: BookID, isDeleted: false }, { isDeleted: true });

            return res.status(200).send({ status: true, message: " Book deleted successfully." });

        } catch (error) {

            return res.status(500).send({ status: false, error: error.message });

        }
    }
}


module.exports = BookController