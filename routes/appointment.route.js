
import express from "express";
const router = express.Router();
import Appointment from '../models/appointment.model.js';
import {getAppointments, getReviewedAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus, 
  getBusyRanges, adminCreateAppointment, getPendingCount, getUserAppointments} from '../controller/appointment.controller.js';
import { verifyFirebaseToken } from '../backend/middleware/auth.ts';

router.get("/busy",getBusyRanges);
router.post("/admin-create", verifyFirebaseToken, adminCreateAppointment);  
router.get("/reviewed", verifyFirebaseToken,getReviewedAppointments);
router.get("/pending-count",verifyFirebaseToken, getPendingCount);
router.get("/user/:userID",verifyFirebaseToken, getUserAppointments);
router.get("/", verifyFirebaseToken, getAppointments);
router.get("/:id",verifyFirebaseToken, getAppointment);
router.post("/", verifyFirebaseToken, createAppointment);
router.put("/:id", verifyFirebaseToken, updateAppointment);
router.patch("/:id/status",verifyFirebaseToken, updateAppointmentStatus);
router.put("/:id/status", verifyFirebaseToken, updateAppointmentStatus);
router.delete("/:id",verifyFirebaseToken, deleteAppointment);
// Update appointment status
router.patch('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rescheduledDateTime } = req.body;

    // This is the line that was failing because 'Appointment' was undefined
    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status, rescheduledDateTime },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// module.exports = router;
export default router;