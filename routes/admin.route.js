const express = require("express");
const Admin = require('../models/admin.model');
const router = express.Router();
const {getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin, loginAdmin, checkAuth, logoutAdmin, } = require('../controller/admin.controller.js');



// keep checkAuth at top bacause it collides with getAdmin and other routes
router.get("/checkAuth", checkAuth);

router.post('/login', loginAdmin);

router.post("/logout", logoutAdmin);

router.get("/", getAdmins);

router.get("/:id", getAdmin);

router.post("/", createAdmin);

router.put("/:id", updateAdmin);

router.delete("/:id", deleteAdmin);





module.exports = router;