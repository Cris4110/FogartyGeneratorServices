const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            default: ""
        },
        appointmentDate: {
            type: Date, //YYYY/MM/DD
            require: true
        },
         appointmentTime: {
            type: String,
            required: true,
            match: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i //12 hour time format requrires two digit hour,
                                                                //two digit min and AM/PM
            
         },
    },    
    {
        timestamps: true,
    }

);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;