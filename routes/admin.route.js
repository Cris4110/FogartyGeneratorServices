const express = require("express");
const Admin = require('../models/admin.model');
const router = express.Router();
const {getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin} = require('../controller/admin.controller.js');



router.get('/', getAdmins);

router.get("/:id",getAdmin);

router.post("/", createAdmin);

router.put("/:id", updateAdmin);

router.delete("/:id", deleteAdmin);

module.exports = router;