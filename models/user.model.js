const mongoose = require('mongoose');

const stateAbbreviations = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const AddressSchema = mongoose.Schema(
    {
        street: {
            type: String,
            required: true,
            default: ""
        },
        city: {
            type: String,
            required: true,
            default: ""
        },
        state: {
            type: String,
            required: true,
            uppercase: true,
            enum: stateAbbreviations
        },
        zipcode: {
            type: String,
            required: true,
            default: ""
        }
    }
)

const UserSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            default: ""
        },

        fullname: {
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
        address: {
            type : AddressSchema,
            required: true
        },       
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;