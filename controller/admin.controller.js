const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');

const getAdmins = async (req, res) =>{
 try {
        const admin = await Admin.find({});
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const getAdmin = async (req, res) =>{
    try {
        const {id} = req.params;
        const admin = await Admin.findById(id);
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createAdmin = async (req, res) => {
  try {
    const { name, userID, password, email, phoneNumber } = req.body;

    // Check if email is already registered
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
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

    const admin = new Admin({
      name,
      userID,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    await admin.save();
    res.status(201).json({ message: "New Admin User Created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
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

    const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
     try {
        const {id} = req.params;
        const admin = await Admin.findByIdAndDelete(id, req.body);
        if(!admin){
            return res.status(404).json({message: "Admin not found"});
        }
        res.status(200).json({message:"Admin was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin
};