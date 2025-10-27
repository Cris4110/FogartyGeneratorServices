const Admin = require('../models/admin.model');

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

    const admin = await Admin.findOne({ userID });
    if (!admin) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const isMatch = password === admin.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    res.status(200).json({ message: "Login successful", admin });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin
};