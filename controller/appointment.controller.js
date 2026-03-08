// const Appointment = require("../models/appointment.model");
// const User = require("../models/user.model");
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import PageContent from '../models/pagecontent.model.js';

// GET all pending appointments
export const getAppointments = async (req, res) => {
  try {
    // before sending results remove any stale documents based on admin setting
    let retentionDoc = await PageContent.findOne({ pageName: 'appointmentRetentionDays' });
    let days = 365; // default
    if (retentionDoc) {
      if (!isNaN(Number(retentionDoc.content))) {
        days = Math.max(30, Math.min(365, Number(retentionDoc.content)));
      }
    } else {
      // create persistent default value so future requests have a record
      try {
        await PageContent.create({ pageName: 'appointmentRetentionDays', content: '30' });
        days = 30;
      } catch {}
    }
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    // delete documents whose effective date (rescheduled if present, otherwise requested) is before the cutoff
    const delResult = await Appointment.deleteMany({
      $expr: {
        $lt: [
          { $ifNull: ["$rescheduledDateTime", "$appointmentDateTime"] },
          cutoff,
        ],
      },
    });
    // log for diagnostics; can remove once retention is confirmed
    console.debug(`appointment retention: removed ${delResult.deletedCount} docs (cutoff=${cutoff.toISOString()})`);

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
export const getReviewedAppointments = async (req, res) => {
  try {
    // apply same retention cleanup for reviewed appointments as well
    let retentionDoc = await PageContent.findOne({ pageName: 'appointmentRetentionDays' });
    let days = 365; // default
    if (retentionDoc) {
      if (!isNaN(Number(retentionDoc.content))) {
        days = Math.max(30, Math.min(365, Number(retentionDoc.content)));
      }
    } else {
      try {
        await PageContent.create({ pageName: 'appointmentRetentionDays', content: '30' });
        days = 30;
      } catch {}
    }
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const delResult = await Appointment.deleteMany({
      $expr: {
        $lt: [
          { $ifNull: ["$rescheduledDateTime", "$appointmentDateTime"] },
          cutoff,
        ],
      },
    });
    console.debug(`appointment retention (reviewed): removed ${delResult.deletedCount} docs (cutoff=${cutoff.toISOString()})`);

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
export const getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Not found" });
    res.json(appt);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE appointment
export const createAppointment = async (req, res) => {
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
export const updateAppointment = async (req, res) => {
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
export const updateAppointmentStatus = async (req, res) => {
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
export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// // EXPORT EVERYTHING
// module.exports = {
//   getAppointments,
//   getReviewedAppointments,
//   getAppointment,
//   createAppointment,
//   updateAppointment,
//   updateAppointmentStatus,
//   deleteAppointment,
// };
