import express from "express";
import Part from '../models/partrequest.model.js';
import {getPartrequests, getPartrequest, createPartrequest, updatePartrequest, deletePartrequest} from '../controller/partrequest.controller.js';
const router = express.Router();



router.get('/', getPartrequests);

router.get("/:id",getPartrequest);

router.post("/", createPartrequest);

router.put("/:id", updatePartrequest);

router.delete("/:id", deletePartrequest);

export default router;