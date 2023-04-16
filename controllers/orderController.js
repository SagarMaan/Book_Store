const { isValidObjectId } = require("mongoose");

const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const { verify } = require("jsonwebtoken");



class OrderController {

    constructor() {
    }

    //=====================================                   ==============================================//
    //                                        Create  Order                                                //
    //=====================================                  ==============================================//


    async createOrder(req, res) {

        try {

            let userId = req.userId

            let body = req.body

            let { cartId, cancellable, orderStatus } = body;

            if (Object.keys(body).length == 0) {
                return res.status(400).send({ status: false, message: " Body can not be empty. " });
            }

            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: " Invalid Cart Id. " })
            }

            let cartData = await cartModel.findOne({_id :cartId}).select({userId : 1 , books : 1 , totalBooks: 1 , totalPrice:1})

            if (!cartData) {
                return res.status(404).send({ status: false, message: " Cart Not Found. " });
            }

            if (cartData.userId != userId) {
                return res.status(404).send({ status: false, message: " This cart is not belong to this user. " });
            }
            if (cancellable) {

                if (cancellable && cancellable !== "true" && cancellable !== "false") {
                    return res.status(400).send({ status: false, message: " Cancellable must be in string and can only be true or false. " })
                }
                cartData.cancellable = cancellable
            }

            if (orderStatus) {

                if (orderStatus && typeof orderStatus != "string") {
                    return res.status(400).send({ status: false, message: " Order status must be in string. " })
                }

                if (!orderStatus || !orderStatus.trim()) {
                    return res.status(400).send({ status: false, message: " Order status must be required or can't be empty. " });
                }

                if (!["pending", "completed", "cancelled"].includes(orderStatus.trim())) {
                    return res.status(400).send({ status: false, message: " Please use a valid order status as pending , completed , cancelled. " });
                }
                cartData.orderStatus = orderStatus
            }

            let createOrder = await orderModel.create(body)
         
            const orderDetails = {
                cartData : cartData,
                orderData : createOrder
            }

            return res.status(201).send({ status: true, message: " Order create successfully. ", data: orderDetails });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message })

        }
    }
 

    //=====================================                   ==============================================//
    //                                       Get Order List                                                //
    //=====================================                  ==============================================//


    async getOrderList(req, res) {

        try {

            let userId = req.userId

            let getOrderList = await orderModel.find({ userId: userId })

            if (!getOrderList) {
                return res.status(400).send({ status: false, message: " Their is no order placed byu this user Id. " });
            }

            let cartData = await cartModel.findOne({ userId: userId }).select({ userId: 1, books: 1, totalBooks: 1, totalPrice: 1 })

            return res.status(200).send({ status: true, message: " Successfully got order list placed by this userId. ", data: cartData });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message })

        }
    }


    //=====================================                   ==============================================//
    //                                        Update Order                                                 //
    //=====================================                  ==============================================//


    async updateOrder(req, res) {

        try {

            let userId = req.userId

            let body = req.body

            let { orderId, orderStatus } = body;

            if (!orderId) {
                return res.status(400).send({ status: false, message: " Please enter orderId. " });
            }

            if (!isValidObjectId(orderId)) {
                return res.status(400).send({ status: false, message: " Please enter valid oredrId. " });
            }

            let verifyOrder = await orderModel.findOne({_id : orderData._id });
console.log(verifyOrder.orderData._id , verifyOrder.userId ,verifyOrder.cartData.userId)
            if (!verifyOrder) {
                return res.status(400).send({ status: false, message: " Order is not exits with in your database. " });
            }

            if (userId != verifyOrder.cartData.userId) {
                return res.status(404).send({ status: false, message: " Order doesn't exist with this user Id. " });
            }

            if (orderStatus) {
                if (!["pending", "completed", "cancelled"].includes(orderStatus.trim())) {
                    return res.status(400).send({ status: false, message: " Please use a valid order status as pending , completed , cancelled. " });
                }

                if (verifyOrder.orderStatus == "completed") {
                    return res.status(200).send({ status: true, message: " Your Order have been placed. " });
                }
                if (verifyOrder.orderStatus == "cancelled") {
                    return res.status(400).send({ status: false, message: " Your order has been Cancelled. " });
                }
                if (verifyOrder.cancellable == false && orderStatus == "cancelled") {
                    return res.status(400).send({ status: false, message: " Your order can't be cancelled. " });
                }
            }

            let orderUpdate = await orderModel.findOneAndUpdate({ _id: orderId, userId: userId }, { orderStatus: orderStatus }, { new: true });

            return res.status(200).send({ status: true, message: " Order update successfully. ", data: orderUpdate });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message })

        }
    }


    //=====================================                   ==============================================//
    //                                        Delete  Order                                                //
    //=====================================                  ==============================================//


    async deleteOrder(req, res) {

        try {

            let userId = req.userId;

            let findOrder = await orderModel.findOneAndUpdate({ userId: userId, isDeleted: false }, { isDeleted: true }, { new: true });

            if (!findOrder) {
                return res.status(403).send({ status: false, message: " Order not found with this userId , it may be deted already. " });
            }

            return res.status(200).send({ status: false, message: " Order deleted sucessfully. " })

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message })

        }
    }
}

module.exports = OrderController