const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            required: true,
            ref: " UserData "
        },
        bookName: {
            type: String,
            required: true
        },
        authorName: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("BookData", bookSchema);