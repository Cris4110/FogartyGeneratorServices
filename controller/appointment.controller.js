const Appointment = require('../models/appointment.model');
const User = require("../models/user.model");
/*
const getAppointments = async (req, res) =>{
 try {
        const appt = await Appointment.find({});
        res.status(200).json(appt);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}
*/
const getAppointments = async (req, res) => {
  try {
    console.log("COLLECTIONS:", {
      appointments: Appointment.collection.name,
      users: User.collection.name,
    });

    const rows = await Appointment.aggregate([
      {
        $lookup: {
          from: User.collection.name,     // <- guarantees correct collection name
          localField: "userID",           // field in appointments
          foreignField: "userID",         // field in users
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          appointmentDate: 1,

          // debug “where did it break?”
          appointmentUserID: "$userID",
          matchedUserID: "$user.userID",

          // fields your UI wants (with placeholders)
          name:  { $ifNull: ["$user.name", "(no match)"] },
          phone: { $ifNull: ["$user.phoneNumber", "(no phone)"] },
          email: { $ifNull: ["$user.email", "(no email)"] },
        },
      },
      // { $sort: { appointmentDate: -1 } },
    ]);

    if (rows.length) console.log("DEBUG sample row:", rows[0]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("getAppointments error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAppointment = async (req, res) =>{
    try {
        const {id} = req.params;
        const appt = await Appointment.findById(id);
        res.status(200).json(appt);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createAppointment = async (req, res) => {
        try {
        const appt = await Appointment.create(req.body);
        res.status(200).json({message: "New Appointment User Created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updateAppointment = async (req, res) => {
     try {
        const {id} = req.params;
        const appt = await Appointment.findByIdAndUpdate(id, req.body);
        if(!appt){
            return res.status(404).json({message: "Appointment not found"});
        }
        const updatedAppointment = await User.findById(id);
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const deleteAppointment = async (req, res) => {
     try {
        const {id} = req.params;
        const appt = await Appointment.findByIdAndDelete(id, req.body);
        if(!appt){
            return res.status(404).json({message: "Appointment not found"});
        }
        res.status(200).json({message:"Appointment was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getAppointment,
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
};