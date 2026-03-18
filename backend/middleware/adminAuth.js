<<<<<<< Updated upstream
import User from "../../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    // 1. Safety check
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // 2. Query the DB
    const user = await User.findById(req.user.uid);

    // 3. Authorization check
    if (user && user.role === "admin") {
      next();
=======
import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    // req.user.uid comes from your Firebase verification middleware
    const user = await User.findById(req.user.uid);
    
    if (user && user.role === "admin") {
      next(); // User is admin, proceed to the controller
>>>>>>> Stashed changes
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
<<<<<<< Updated upstream
    console.error("Admin Check Error:", error);
=======
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error checking permissions." });
  }
};