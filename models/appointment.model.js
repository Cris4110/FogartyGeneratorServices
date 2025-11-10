const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            default: ""
        },
        appointmentTime: {
            type: String, // Format: MMMM DD, YYYY TT:TT AM/PM
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
    },    
    {
        timestamps: true,
    }

);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;