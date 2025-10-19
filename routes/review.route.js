const express = require("express");
const Review = require('../models/review.model');
const router = express.Router();
const {getReviews, getReview, createReview, updateReview, deleteReview} = require('../controller/review.controller.js');



router.get('/', getReviews);

router.get("/:id",getReview);

router.post("/", createReview);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

module.exports = router;