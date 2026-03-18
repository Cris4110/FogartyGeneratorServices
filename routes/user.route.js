import express from "express";
import User from "../models/user.model.js";
<<<<<<< Updated upstream
import { getUsers, getUser, createUser, updateUser, deleteUser, updateUserRole } from "../controller/user.controller.js";
import { verifyFirebaseToken } from "../backend/middleware/auth.ts";
import { isAdmin } from "../backend/middleware/adminAuth.js";
import { getAuth } from "firebase-admin/auth";

const router = express.Router();
import admin from 'firebase-admin';
router.post("/", createUser);

router.post("/login", verifyFirebaseToken, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
=======
import { getUsers, getUser, createUser, updateUser, deleteUser, updateUserRole} from "../controller/user.controller.js";
import { verifyFirebaseToken } from "../backend/middleware/auth.ts"; 

const router = express.Router();

router.post("/", createUser); 

router.post("/login", verifyFirebaseToken, (req, res) => {
    res.status(200).json({ message: "Authenticated", user: req.user });
>>>>>>> Stashed changes
})

// Protected routes: require a valid Firebase token
router.get('/', verifyFirebaseToken, getUsers);
router.get("/:id", verifyFirebaseToken, getUser);
router.put("/:id", verifyFirebaseToken, updateUser);
<<<<<<< Updated upstream
router.delete("/:uid", verifyFirebaseToken, deleteUser);
=======
router.delete("/:id", verifyFirebaseToken, deleteUser);
>>>>>>> Stashed changes

router.patch('/:id/role', verifyFirebaseToken, updateUserRole);

router.get("/me/:id", verifyFirebaseToken, async (req, res) => {
<<<<<<< Updated upstream
  try {
    const { id } = req.params;

    // Security check: ensure the logged-in user is requesting THEIR OWN data
    if (req.user.uid !== id) {
      return res.status(403).json({ error: "Access denied: Unauthorized UID" });
    }

    const user = await User.findById(id).select("name email role userID phoneNumber address");

    if (!user) return res.status(404).json({ error: "user not found" });

    res.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        userID: user.userID,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
=======
    try {
        const { id } = req.params; 
        
        // Security check: ensure the logged-in user is requesting THEIR OWN data
        if (req.user.uid !== id) {
            return res.status(403).json({ error: "Access denied: Unauthorized UID" });
        }

        const user = await User.findById(id).select("name email role userID phoneNumber address");
        
        if (!user) return res.status(404).json({ error: "user not found" });
        
        res.json({
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                userID: user.userID, 
                role: user.role,   
                phoneNumber: user.phoneNumber,
                address: user.address,    
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.patch('/:id/role', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role input
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role type" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Backend Role Error:", error);
    res.status(500).json({ message: "Server error updating role" });
>>>>>>> Stashed changes
  }
});
router.patch('/:id/role', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role input
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role type" });
    }

<<<<<<< Updated upstream
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Backend Role Error:", error);
    res.status(500).json({ message: "Server error updating role" });
  }
});


=======
>>>>>>> Stashed changes
export default router;