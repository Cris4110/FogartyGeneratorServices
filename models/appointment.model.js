const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            default: ""
        },
        appointmentDate: {
            type: String,
            require: true
        },
        appointmentTime: {
            type: String,
            require: true
        },
        generatorModel: {
            type: String,
            required: false, // optional
            default: "",
        },
        serialNumber: {
            type: String,
            required: false, // optional
            default: "",
        },
        description: {
            type: String,
            required: false, // optional
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "denied", "rescheduled"],
            default: "pending"
        },
        newAppointmentTime: {
            type: Date,
            default: null
        },
    },    
    {
        timestamps: true,
    }

);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;