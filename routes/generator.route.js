import express from "express";
import Generator from '../models/generator.model.js';
const router = express.Router();
import {getGens, getGen, createGen, updateGen, deleteGen} from '../controller/generator.controller.js';
const multer = require('multer');
const path = require('path');

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

export default router;