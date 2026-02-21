const express = require("express");
const Review = require('../models/review.model');
const router = express.Router();
const {getReviews, getReview, createReview, updateReview, deleteReview} = require('../controller/review.controller.js');



router.get('/', getReviews);

router.get("/:id",getReview);

router.post("/", createReview);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

router.patch("/:id/verified", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body; // boolean

    const updated = await Review.findByIdAndUpdate(
      id,
      { verified: !!verified },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;