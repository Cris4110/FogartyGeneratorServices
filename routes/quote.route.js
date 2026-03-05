import express from "express";
import Quote from '../models/quote.model.js';
const router = express.Router();
import {getQuotes, getQuote, createQuote, updateQuote, deleteQuote, setAcknowledged} from '../controller/quote.controller.js';
import { set } from "mongoose";

router.get("/", getQuotes);
router.get("/:id", getQuote);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);
router.patch("/:id/acknowledge", setAcknowledged);

export default router;