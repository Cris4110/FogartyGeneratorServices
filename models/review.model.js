const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
    {
        reviewID: {
            type: String,
            required: true,
            default: ""
        },

        name: {
            type: String,
            required: true,
            default: ""
        },

        rating: {
            type: Number,
            required: true,
            default: "",
            min: 1,
            max:5
            
        },

        comment: {
            type: String,
            required: true,
            default: ""
        },

        createdAt: {
            type: Date,
            required: true,
            default: ""
        },

        verified: {
            type: Boolean,
            required: true,
            default: ""
        },
       
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;