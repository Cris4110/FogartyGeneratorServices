import express from "express";
import Quote from '../models/quote.model.js';
const router = express.Router();
import {getQuotes, getQuote, updateQuote, deleteQuote, setAcknowledged,getPendingQuotes} from '../controller/quote.controller.js';
import { set } from "mongoose";
import { createQuote } from "../controller/quote.controller.js";
import { verifyFirebaseToken } from '../backend/middleware/auth.ts';


router.get("/", verifyFirebaseToken, getQuotes);
router.get("/pending-quotes", verifyFirebaseToken, getPendingQuotes);
router.get("/:id", verifyFirebaseToken, getQuote);
router.post("/", verifyFirebaseToken, createQuote);
router.put("/:id", verifyFirebaseToken, updateQuote);
router.delete("/:id", verifyFirebaseToken, deleteQuote);
router.patch("/:id/acknowledge", verifyFirebaseToken, setAcknowledged);


export default router;