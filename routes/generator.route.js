const express = require("express");
const Generator = require('../models/generator.model.js');
const router = express.Router();
const {getGens, getGen, createGen, updateGen, deleteGen} = require('../controller/generator.controller.js');



router.get('/', getGens);

router.get("/:id",getGen);

router.post("/", createGen);

router.put("/:id", updateGen);

router.delete("/:id", deleteGen);

module.exports = router;