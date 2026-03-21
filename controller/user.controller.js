import User from "../models/user.model.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params; // This will be the MongoDB _id from your frontend
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role type" });
    }

    // We use findByIdAndUpdate because your frontend sends the _id
    const user = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by Firebase UID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ userID: id }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const userData = {
      ...req.body,
      role: req.body.role || "user"
    };
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({ message: "User profile created in database", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndDelete to match the MongoDB _id sent from the frontend
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }
    
    res.status(200).json({ message: "User was successfully deleted" });
  } catch (error) {
    // If the ID is malformed, it hits this catch block
    res.status(500).json({ message: "Error deleting user: " + error.message });
  }
};