const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            unique: true,
            ref: " UserData "
        },
        cartId: {
            type: ObjectId,
            ref: " CartData "
        },
        books: [{
            bookId: {
                type: ObjectId,
                ref: " BookData "
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            },
        }],
        totalBooks: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("CartData", cartSchema);