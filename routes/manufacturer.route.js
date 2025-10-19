const express = require("express");
const Manufacturer = require('../models/manufacturer.model.js');
const router = express.Router();
const {getManufacturers, getManufacturer, createManufacturer, updateManufacturer, deleteManufacturer} = require('../controller/manufacturer.controller.js');



router.get('/', getManufacturers);

router.get("/:id",getManufacturer);

router.post("/", createManufacturer);

router.put("/:id", updateManufacturer);

router.delete("/:id", deleteManufacturer);

module.exports = router;