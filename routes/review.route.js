import express from "express";
const router = express.Router();
import {getReviews, getReview, createReview, updateReview, deleteReview, getPublicReviews} from "../controller/review.controller.js";


router.get("/public", getPublicReviews);

router.get('/', getReviews);

router.get("/:id",getReview);

router.post("/", createReview);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);


export default router;