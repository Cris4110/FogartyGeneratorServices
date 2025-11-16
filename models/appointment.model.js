const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            default: ""
        },
        appointmentDateTime: {
            type: Date,
            require: true
        },
        rescheduledDateTime: {
            type: Date,
            default: null
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
        
    },    
    {
        timestamps: true,
    }

);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;