const Review = require('../models/review.model');

const getReviews = async (req, res) =>{
 try {
        const review = await Review.find({});
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const getReview = async (req, res) =>{
    try {
        const {id} = req.params;
        const review = await Review.findById(id);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createReview = async (req, res) => {
        try {
        const review = await Review.create(req.body);
        res.status(200).json({message: "New Review Created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updateReview = async (req, res) => {
     try {
        const {id} = req.params;
        const review = await Review.findByIdAndUpdate(id, req.body);
        if(!review){
            return res.status(404).json({message: "Review not found"});
        }
        const updatedReview = await Review.findById(id);
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const deleteReview = async (req, res) => {
     try {
        const {id} = req.params;
        const review = await Review.findByIdAndDelete(id, req.body);
        if(!review){
            return res.status(404).json({message: "Review not found"});
        }
        res.status(200).json({message:"Review was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
};