import express from "express";
import returns from '../models/returns.model.js';
import {getReturn, createReturn} from '../controller/returns.controller.js';
const router = express.Router();

router.get('/', getReturn);
router.post("/", createReturn);


export default router;