const express = require("express");
const Quote = require('../models/quote.model');
const router = express.Router();
const {getQuotes, getQuote, createQuote, updateQuote, deleteQuote, setAcknowledged} = require('../controller/quote.controller.js');
const { set } = require("mongoose");

router.get("/", getQuotes);
router.get("/:id", getQuote);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);
router.patch("/:id/acknowledge", setAcknowledged);

module.exports = router;