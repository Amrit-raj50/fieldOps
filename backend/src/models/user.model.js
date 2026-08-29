const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            // required:true,
        },
        role: {
            type: String,
            enum: {
                values: ["admin", "employee"],
                message: "role must be asdmin or employee"
            },
            default: "employee"
        },
        profileImage: {
            type: String,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        lastlocation: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
);

const user = mongoose.model('User', userSchema);
module.exports = user;