const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
    {
        reviewer: {
            type: ObjectId,
            required: true,
            ref: "UserData"
        },
        bookId: {
            type: ObjectId,
            required: true,
            ref: "BookData"
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        review: {
            type: String,
            required: true
        },
        reviewedAt: {
            type: Date,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("ReviewData", reviewSchema);
