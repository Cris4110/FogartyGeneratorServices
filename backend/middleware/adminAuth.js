import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    // req.user.uid comes from your Firebase verification middleware
    const user = await User.findById(req.user.uid);
    
    if (user && user.role === "admin") {
      next(); // User is admin, proceed to the controller
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error checking permissions." });
  }
};