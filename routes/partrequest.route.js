const express = require("express");
const Part = require('../models/partrequest.model');
const {getPartrequests, getPartrequest, createPartrequest, updatePartrequest, deletePartrequest, getPendingParts} = require('../controller/partrequest.controller.js');
const router = express.Router();



router.get('/', getPartrequests);

router.get('/pending-parts', getPendingParts);

router.get("/:id",getPartrequest);

router.post("/", createPartrequest);

router.put("/:id", updatePartrequest);

router.delete("/:id", deletePartrequest);

module.exports = router;