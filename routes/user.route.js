const express = require("express");
const User = require('../models/user.model');
const router = express.Router();
const {getUsers, getUser, createUser, updateUser, deleteUser} = require('../controller/user.controller.js');
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const COOKIE_NAME = "access_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"; 

require('dotenv').config();

router.get("/me", requireAuth, async (req, res) => {
  // req.user.sub was set by requireAuth above
  const user = await User.findById(req.user.sub).select("name email role");
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
});

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

// helper to sign
function signToken(userId, email) {
  return jwt.sign(
    { sub: String(userId), email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "12h" }
  );
}
// middleware to require auth
function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET); // { sub, email, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}

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

    const token = signToken(user._id, user.email);

    // HttpOnly cookie (secure=false for localhost; true in production over HTTPS)
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 1000*60*60*12 // 12h (or 1000*60*3 for 3 minutes testing)
      //12 hours = 1000 milliseconds * 60 seconds * 60 minutes * 12 hours
    });

    res.status(200).json({
      message: 'Login successful!',
      user: { id: String(user._id), name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
});

module.exports = router;
