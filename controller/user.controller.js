const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) =>{
 try {
        const user = await User.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const getUser = async (req, res) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createUser = async (req, res) => {
         try {
    const { name, userID, password, email, phoneNumber, address } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate password pattern
    const passwordRegex = /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){2,}).{12,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 12 characters long and include at least 2 uppercase, 2 lowercase, 2 numbers, and 2 special characters.",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      userID,
      password: hashedPassword,
      email,
      phoneNumber,
      address
    });

    await user.save();
    res.status(201).json({ message: "New User Created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
    


const updateUser = async (req, res) => {
      try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password is provided in update, hash it again
    if (updateData.password) {
      const passwordRegex = /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){2,}).{12,}$/;
      if (!passwordRegex.test(updateData.password)) {
        return res.status(400).json({
          message:
            "Password must be at least 12 characters long and include at least 2 uppercase, 2 lowercase, 2 numbers, and 2 special characters.",
        });
      }
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
    
const deleteUser = async (req, res) => {
     try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id, req.body);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message:"User was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};