const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            default: ""
        },

        password: {
            type: String,
            required: true,
            default: ""
        },

        email: {
            type: String,
            required: true,
            default: ""
        },

        phoneNumber: {
            type: Number,
            required: true,
            default: 0
        },        
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;