const express = require("express");
const Generator = require('../models/generator.model.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {getGens, getGen, createGen, updateGen, deleteGen} = require('../controller/generator.controller.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

router.get('/', getGens);

router.get("/:id",getGen);

router.post("/", upload.array('images', 10), createGen);

router.put("/:id", upload.array('images', 10), updateGen);

router.delete("/:id", deleteGen);

module.exports = router;