const Appointment = require('../models/appointment.model');

const getAppointments = async (req, res) =>{
 try {
        const appt = await Appointment.find({});
        res.status(200).json(appt);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const getAppointment = async (req, res) =>{
    try {
        const {id} = req.params;
        const appt = await Appointment.findById(id);
        res.status(200).json(appt);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createAppointment = async (req, res) => {
        try {
        const appt = await Appointment.create(req.body);
        res.status(200).json({message: "New Appointment User Created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updateAppointment = async (req, res) => {
     try {
        const {id} = req.params;
        const appt = await Appointment.findByIdAndUpdate(id, req.body);
        if(!appt){
            return res.status(404).json({message: "Appointment not found"});
        }
        const updatedAdmin = await Admin.findById(id);
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const deleteAppointment = async (req, res) => {
     try {
        const {id} = req.params;
        const appt = await Appointment.findByIdAndDelete(id, req.body);
        if(!appt){
            return res.status(404).json({message: "Appointment not found"});
        }
        res.status(200).json({message:"Appointment was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getAppointment,
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
};