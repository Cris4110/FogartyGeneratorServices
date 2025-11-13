const Generator = require('../models/generator.model');

const getGens = async (req, res) =>{
 try {
        const gen = await Generator.find({});
        res.status(200).json(gen);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const getGen = async (req, res) =>{
    try {
        const {id} = req.params;
        const gen = await Generator.findById(id);
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createGen = async (req, res) => {
        try {
        const gen = await Generator.create(req.body);
        res.status(200).json({message: "Generators created!"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updateGen = async (req, res) => {
     try {
        const {id} = req.params;
        const gen = await Generator.findByIdAndUpdate(id, req.body);
        if(!gen){
            return res.status(404).json({message: "Generator not found"});
        }
        const updatedGen = await Generator.findById(id);
        res.status(200).json(updatedGen);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const deleteGen = async (req, res) => {
     try {
        const {id} = req.params;
        const gen = await Generator.findByIdAndDelete(id, req.body);
        if(!gen){
            return res.status(404).json({message: "Generator not found"});
        }
        res.status(200).json({message:"Generator was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getGens,
    getGen,
    createGen,
    updateGen,
    deleteGen
};