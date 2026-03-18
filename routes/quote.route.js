import express from "express";
import Quote from '../models/quote.model.js';
const router = express.Router();
<<<<<<< Updated upstream
import {getQuotes, getQuote, createQuote, updateQuote, deleteQuote, setAcknowledged} from '../controller/quote.controller.js';
=======
import {getQuotes, getQuote, createQuote, updateQuote, deleteQuote, setAcknowledged,getPendingQuotes} from '../controller/quote.controller.js';
>>>>>>> Stashed changes
import { set } from "mongoose";

router.get("/", getQuotes);
router.get("/:id", getQuote);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);
router.patch("/:id/acknowledge", setAcknowledged);

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
export default router;