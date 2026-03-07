const express = require("express");
const Part = require('../models/part.model');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {getParts, getPart, createPart, updatePart, deletePart} = require('../controller/part.controller.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', getParts);

router.get("/:id",getPart);

router.post("/", upload.array('images', 10), createPart);

router.put("/:id", upload.array('images', 10), updatePart);

router.delete("/:id", deletePart);

module.exports = router;