const mongoose = require('mongoose');
const {User} = require("./user.model");

// Admin extends User
const AdminSchema = new mongoose.Schema(
    {
        permissions: {
            type: [String],
            default: ["manage_users", "view_reports", "modify_data"],
        },
        adminLevel: {
            type: Number,
            min: 1,
            max: 5,
            default: 1,
        }
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;