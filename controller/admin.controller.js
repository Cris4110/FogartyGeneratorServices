const Admin = require('../models/admin.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
        const admin = await Admin.create(req.body);
        res.status(200).json({message: "New Admin User Created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updateAdmin = async (req, res) => {
     try {
        const {id} = req.params;
        const admin = await Admin.findByIdAndUpdate(id, req.body);
        if(!admin){
            return res.status(404).json({message: "Admin not found"});
        }
        const updatedAdmin = await Admin.findById(id);
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

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

const loginAdmin = async (req, res) => {
  try {
    const { userID, password } = req.body;

    // check if username is correct
    const admin = await Admin.findOne({ userID });
    if (!admin) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    // Compare password with hashed (unable to use as passwords in db aren't hashed)
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === admin.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    // JWT token
    const token = jwt.sign(
      { id: admin._id, userID: admin.userID },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "2h" }
    );

    //Set token to http only cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 2, // age of token = 2 hours (milliseconds to seconds to minutes to hours)
      }).status(200).json({
        message: "Login successful",
        admin: {
          id: admin._id,
          userID: admin.userID,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const verified = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const admin = await Admin.findById(verified.id).select("password");

    if (!admin) {
      res.clearCookie("token");
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error("Auth check error:", error);

    // Clears cookie if verification failed
    res.clearCookie("token");
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// admin logout for navbar logout button
const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out" });
};

module.exports = {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    checkAuth,
    logoutAdmin,
};