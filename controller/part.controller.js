import Part from '../models/part.model.js';

export const getParts = async (req, res) =>{
 try {
        const part = await Part.find({});
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export const getPart = async (req, res) =>{
    try {
        const {id} = req.params;
        const part = await Part.findById(id);
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export const createPart = async (req, res) => {
        try {

        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const partData = {
            ...req.body,
            images: imagePaths // Now storing as an array in the "images" field
        };    
        const part = await Part.create(partData);
        res.status(200).json({message: "New part added to database.", part});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

export const updatePart = async (req, res) => {
     try {
        const {id} = req.params;
        let updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        }
        const part = await Part.findByIdAndUpdate(id, updateData);
        if(!part){
            return res.status(404).json({message: "Part not found"});
        }
        const updatedPart = await Part.findById(id);
        res.status(200).json(updatedPart);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

export const deletePart = async (req, res) => {
     try {
        const {id} = req.params;
        //const part = await Part.findOneAndDelete({partID: id}).select('partID');

        const part = await Part.findByIdAndDelete(id);
        if(!part){
            return res.status(404).json({message: "Part not found"});
        }
        res.status(200).json({message:"Part was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}
