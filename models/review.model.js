const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
    {
        reviewID: {
            type: String,
            required: true,
            default: ""
        },

        starRating: {
            type: Number,
            required: true,
            default: 0,
            min: 1,
            max:5
            
        },

        comment: {
            type: String,
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