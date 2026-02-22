import Review from "../models/review.model.js";

export const getReviews = async (req, res) =>{
 try {
        const review = await Review.find({});
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export const getReview = async (req, res) =>{
    try {
        const {id} = req.params;
        const review = await Review.findById(id);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export const createReview = async (req, res) => {
        try {
        const review = await Review.create(req.body);
        res.status(200).json({message: "New Review Created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

export const updateReview = async (req, res) => {
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

export const deleteReview = async (req, res) => {
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

// Public endpoint for homepage marquee
export const getPublicReviews = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "5", 10), 50);

    const filter = {verified: true};

    const reviews = await Review.find({ verified: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json(reviews);
  } catch (err) {
    console.error("getPublicReviews error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};