const Appointment = require('../models/appointment.model');
const User = require("../models/user.model");

//section for getting appointments with user details included.
const getAppointments = async (req, res) => {
  try {
    console.log("COLLECTIONS:", {
      appointments: Appointment.collection.name,
      users: User.collection.name,
    });
    
    const rows = await Appointment.aggregate([
      {
        $lookup: {
          from: User.collection.name,     // users collection
          localField: "userID",           // field in appointments
          foreignField: "userID",         // field in users
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, // keep appts even if no user match
      {
        $project: {
          _id: 1, // keep appointment _id
          appointmentTime: 1, // keep appointmentTime

          appointmentUserID: "$userID", // from appointment
          matchedUserID: "$user.userID", // from user (if any)

          //user details, with null checks
          name:  { $ifNull: ["$user.name", "(no match)"] },
          phone: { $ifNull: ["$user.phoneNumber", "(no phone)"] },
          email: { $ifNull: ["$user.email", "(no email)"] },
          
          //really complicated section for address, but could be simplied with
          /*
          address: {
            $concat: [
              "$user.address.street", ", ",
              "$user.address.city", ", ",
              "$user.address.state", " ",
              "$user.address.zip"
            ]
          }*/
          //reason for complicated null checks is because majoirty of current users don't have address filled out, so error when checking addresses.

          address: {
          $concat: [
            { $ifNull: ["$user.address.street", ""] },
            {
              $cond: [
                { $and: [
                  { $ne: [{ $ifNull: ["$user.address.street", ""] }, ""] },
                  { $ne: [{ $ifNull: ["$user.address.city", ""] }, ""] }
                ]},
                ", ",
                ""
              ]
            },
            { $ifNull: ["$user.address.city", ""] },
            {
              $cond: [
                { $and: [
                  { $ne: [{ $ifNull: ["$user.address.city", ""] }, ""] },
                  { $ne: [{ $ifNull: ["$user.address.state", ""] }, ""] }
                ]},
                ", ",
                ""
              ]
            },
            { $ifNull: ["$user.address.state", ""] },
            {
              $cond: [
                { $and: [
                  { $ne: [{ $ifNull: ["$user.address.state", ""] }, ""] },
                  { $ne: [{ $ifNull: ["$user.address.zip", ""] }, ""] }
                ]},
                " ",
                ""
              ]
            },
            { $ifNull: ["$user.address.zip", ""] }
          ]
        },

          generatorModel: { $ifNull: ["$generatorModel", ""] },
          serialNumber:   { $ifNull: ["$serialNumber", ""] },
          description:   { $ifNull: ["$description", ""] },
        },
      },
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