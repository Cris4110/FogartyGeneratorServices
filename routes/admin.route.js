const express = require("express");
const Admin = require('../models/admin.model');
const router = express.Router();
const {getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin} = require('../controller/admin.controller.js');
const bcrypt = require('bcrypt');



router.get('/', getAdmins);

router.get("/:id",getAdmin);

router.post("/", createAdmin);

router.put("/:id", updateAdmin);

router.delete("/:id", deleteAdmin);

//SIGNUP (create admin account securely)
router.post('/signup', async (req, res) => {
  try {
    const { name, userID, password, email, phoneNumber } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const newAdmin = new Admin({ name, userID, password, email, phoneNumber });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//LOGIN (authenticate admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // Compare plain password with hashed password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // If you plan to use JWT later, you can generate a token here
    res.status(200).json({ message: 'Login successful!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;