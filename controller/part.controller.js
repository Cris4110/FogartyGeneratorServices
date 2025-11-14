const Part = require('../models/part.model');

const getParts = async (req, res) =>{
 try {
        const part = await Part.find({});
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const getPart = async (req, res) =>{
    try {
        const {id} = req.params;
        const part = await Part.findById(id);
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createPart = async (req, res) => {
        try {
        const part = await Part.create(req.body);
        res.status(200).json({message: "New part added to database."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updatePart = async (req, res) => {
     try {
        const {id} = req.params;
        const part = await Part.findByIdAndUpdate(id, req.body);
        if(!part){
            return res.status(404).json({message: "Part not found"});
        }
        const updatedPart = await Part.findById(id);
        res.status(200).json(updatedPart);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const deletePart = async (req, res) => {
     try {
        const {id} = req.params;
        const part = await Part.findOneAndDelete({partID: id}).select('partID');
        if(!part){
            return res.status(404).json({message: "Part not found"});
        }
        res.status(200).json({message:"Part was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getParts,
    getPart,
    createPart,
    updatePart,
    deletePart
};