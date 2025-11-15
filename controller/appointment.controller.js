const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const dayjs = require("dayjs");


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
          appointmentDate: 1,
          appointmentTime: 1,
          status: 1,
          newAppointmentDate: 1,
          newAppointmentTime: 1,
          name: { $ifNull: ["$user.name", "(no match)"] },
          phone: { $ifNull: ["$user.phoneNumber", "(no phone)"] },
          email: { $ifNull: ["$user.email", "(no email)"] },
          address: { $ifNull: ["$user.address.fullAddress", ""] },
          generatorModel: 1,
          serialNumber: 1,
          description: 1,
        },
      },
    ]);

    res.json(rows);

  } catch (err) {
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
          appointmentDate: 1,
          appointmentTime: 1,
          status: 1,
          newAppointmentDate: 1,
          newAppointmentTime: 1,
          name: { $ifNull: ["$user.name", "(no match)"] },
          phone: { $ifNull: ["$user.phoneNumber", "(no phone)"] },
          email: { $ifNull: ["$user.email", "(no email)"] },
          address: { $ifNull: ["$user.address.fullAddress", ""] },
          description: 1,
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
      appointmentDate,
      appointmentTime,
      generatorModel,
      serialNumber,
      description,
    } = req.body;

    const appt = await Appointment.create({
      userID,
      appointmentDate,
      appointmentTime,
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


// UPDATE appointment (admin edits core data)
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
    const { status, newAppointmentDate, newAppointmentTime } = req.body;

    const updateData = { status };

    if (status === "rescheduled") {
      updateData.newAppointmentDate = newAppointmentDate || null;
      updateData.newAppointmentTime = newAppointmentTime || null;
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

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
