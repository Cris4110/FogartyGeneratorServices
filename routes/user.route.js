const express = require("express");
const User = require('../models/user.model');
const router = express.Router();
const {getUsers, getUser, createUser, updateUser, deleteUser} = require('../controller/user.controller.js');
const bcrypt = require('bcrypt');



router.get('/', getUsers);

router.get("/:id",getUser);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

//SIGNUP (create user account securely)
router.post('/signup', async (req, res) => {
  try {
    const { name, userID, password, email, phoneNumber } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const newUser = new User({ name, userID, password, email, phoneNumber });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//LOGIN (authenticate user)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare plain password with hashed password
    const isMatch = await user.comparePassword(password);
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
