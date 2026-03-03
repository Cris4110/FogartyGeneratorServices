// const express = require("express");
//const Appointment = require('../models/appointment.model.js');
// const router = express.Router();
// const {getAppointments, getReviewedAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus} = require('../controller/appointment.controller.js');

import express from "express";
const router = express.Router();
import {getAppointments, getReviewedAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus, getBusyRanges, adminCreateAppointment, getPendingCount} from '../controller/appointment.controller.js';

router.get("/busy",getBusyRanges);
router.post("/admin-create", adminCreateAppointment);
router.get("/reviewed", getReviewedAppointments);
router.get("/pending-count", getPendingCount);
router.get("/", getAppointments);
router.get("/:id", getAppointment);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.put("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);


// module.exports = router;
export default router;