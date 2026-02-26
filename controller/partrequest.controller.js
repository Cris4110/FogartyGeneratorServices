const Partrequest = require('../models/partrequest.model');

const getPartrequests  = async (req, res) =>{
 try {
        const part = await Partrequest.find({});
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const getPartrequest = async (req, res) =>{
    try {
        const {id} = req.params;
        const partrequest = await Partrequest.findById(id);
        res.status(200).json(partrequest);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createPartrequest = async (req, res) => {
        try {
        const partrequest = await Partrequest.create(req.body);
        res.status(200).json({message: "New part request added."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updatePartrequest = async (req, res) => {
     try {
        const {id} = req.params;
        const partrequest = await Partrequest.findByIdAndUpdate(id, req.body);
        if(!partrequest){
            return res.status(404).json({message: "Part request not found"});
        }
        const updatePartrequest = await Partrequest.findById(id);
        res.status(200).json(updatePartrequest);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const deletePartrequest = async (req, res) => {
     try {
        const {id} = req.params;
        const partrequest = await Partrequest.findOneAndDelete(id);
        if(!partrequest){
            return res.status(404).json({message: "Part request not found"});
        }
        res.status(200).json({message:"part request was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getPartrequests,
    getPartrequest,
    createPartrequest,
    updatePartrequest,
    deletePartrequest
};