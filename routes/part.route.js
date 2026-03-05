import express from "express";
import Part from '../models/part.model.js';
const router = express.Router();
import {getParts, getPart, createPart, updatePart, deletePart} from '../controller/part.controller.js';



router.get('/', getParts);

router.get("/:id",getPart);

router.post("/", createPart);

router.put("/:id", updatePart);

router.delete("/:id", deletePart);

export default router;