const express = require("express");
const Quote = require('../models/quote.model');
const router = express.Router();
const {getQuotes, getQuote, createQuote, updateQuote, deleteQuote} = require('../controller/quote.controller.js');

router.get("/", getQuotes);
router.get("/:id", getQuote);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);

module.exports = router;