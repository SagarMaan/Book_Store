const mongoose = require("mongoose")


const userSchema = new mongoose.Schema(
    {
        // title: {
        //     type: String,
        //     required: true,
        //     enum: ["Mr.", "Mrs", "Miss"]
        // },
        firstName: {
            type: String,
            required: true,
            lowerCase: true
        },
        lastName: {
            type: String,
            required: true,
            lowerCase: true
        },
        emailId: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 15
        },
        phoneNumber: {
            type: Number,
            required: true,
            unique: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            pincode: {
                type: Number,
                required: true
            }
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("UserData", userSchema);