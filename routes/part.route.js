import express from "express";
import Part from '../models/part.model.js';
const router = express.Router();
import {getParts, getPart, createPart, updatePart, deletePart} from '../controller/part.controller.js';
import multer from 'multer';
import path from 'path';

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

export default router;