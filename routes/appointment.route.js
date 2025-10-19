const express = require("express");
const Appointment = require('../models/appointment.model.js');
const router = express.Router();
const {getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment} = require('../controller/appointment.controller.js');



router.get('/', getAppointments);

router.get("/:id",getAppointment);

router.post("/", createAppointment);

router.put("/:id", updateAppointment);

router.delete("/:id", deleteAppointment);

module.exports = router;