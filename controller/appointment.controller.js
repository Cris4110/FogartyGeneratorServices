const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");

// GET all pending appointments
const getAppointments = async (req, res) => {
  try {
    const rows = await Appointment.aggregate([
      { $match: { status: "pending" } },

      {
        $lookup: {
          from: User.collection.name,
          localField: "userID",
          foreignField: "userID",
          as: "user",
        },
      },

      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          appointmentDateTime: 1,
          rescheduledDateTime: 1,
          createdAt: 1,
          status: 1,
          description: 1,
          generatorModel: 1,
          serialNumber: 1,

          name: { $ifNull: ["$user.name", "(no name)"] },
          phone: { $ifNull: ["$user.phoneNumber", "(no phone)"] },
          email: { $ifNull: ["$user.email", "(no email)"] },

          address: {
            $concat: [
              { $ifNull: ["$user.address.street", ""] }, ", ",
              { $ifNull: ["$user.address.city", ""] }, ", ",
              { $ifNull: ["$user.address.state", ""] }, " ",
              { $ifNull: ["$user.address.zipcode", ""] }
            ]
          },
        },
      },
    ]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// GET all reviewed appointments
const getReviewedAppointments = async (req, res) => {
  try {
    const rows = await Appointment.aggregate([
      { $match: { status: { $ne: "pending" } } },

      {
        $lookup: {
          from: User.collection.name,
          localField: "userID",
          foreignField: "userID",
          as: "user",
        },
      },

      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          appointmentDateTime: 1,
          rescheduledDateTime: 1,
          status: 1,
          generatorModel: 1,
          serialNumber: 1,
          description: 1,

          name: { $ifNull: ["$user.name", "(no match)"] },
          phone: { $ifNull: ["$user.phoneNumber", "(no phone)"] },
          email: { $ifNull: ["$user.email", "(no email)"] },

          address: {
            $concat: [
              { $ifNull: ["$user.address.street", ""] }, ", ",
              { $ifNull: ["$user.address.city", ""] }, ", ",
              { $ifNull: ["$user.address.state", ""] }, " ",
              { $ifNull: ["$user.address.zipcode", ""] }
            ]
          }
        },
      },
    ]);

    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET single appointment
const getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Not found" });
    res.json(appt);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE appointment
const createAppointment = async (req, res) => {
  try {
    const {
      userID,
      appointmentDateTime,
      generatorModel,
      serialNumber,
      description,
    } = req.body;

    const appt = await Appointment.create({
      userID,
      appointmentDateTime: new Date(appointmentDateTime),
      generatorModel,
      serialNumber,
      description,
      status: "pending",
    });

    res.json({ message: "Appointment created", appt });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE appointment
const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE status or reschedule
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, newAppointmentTime } = req.body;

    const update = { status };

    if (status === "rescheduled" && newAppointmentTime) {
      update.rescheduledDateTime = new Date(newAppointmentTime);
    }

    const result = await Appointment.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE appointment
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// EXPORT EVERYTHING
module.exports = {
  getAppointments,
  getReviewedAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
