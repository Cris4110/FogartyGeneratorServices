const express = require("express");
const Part = require('../models/part.model');
const router = express.Router();
const {getParts, getPart, createPart, updatePart, deletePart} = require('../controller/part.controller.js');



router.get('/', getParts);

router.get("/:id",getPart);

router.post("/", createPart);

router.put("/:id", updatePart);

router.delete("/:id", deletePart);

module.exports = router;