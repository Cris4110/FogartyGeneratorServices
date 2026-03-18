import express from "express";
import Part from '../models/partrequest.model.js';
<<<<<<< Updated upstream
import {getPartrequests, getPartrequest, createPartrequest, updatePartrequest, deletePartrequest} from '../controller/partrequest.controller.js';
=======
import {getPartrequests, getPartrequest, createPartrequest, updatePartrequest, deletePartrequest,getPendingParts} from '../controller/partrequest.controller.js';
>>>>>>> Stashed changes
const router = express.Router();



router.get('/', getPartrequests);

<<<<<<< Updated upstream
=======
router.get("/pending-parts", getPendingParts);

>>>>>>> Stashed changes
router.get("/:id",getPartrequest);

router.post("/", createPartrequest);

router.put("/:id", updatePartrequest);

router.delete("/:id", deletePartrequest);

export default router;