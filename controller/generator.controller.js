const Generator = require('../models/generator.model');

// Get all generators
const getGens = async (req, res) => {
    try {
        const generators = await Generator.find({});
        res.status(200).json(generators); // <-- return the fetched data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single generator by ID
const getGen = async (req, res) => {
    try {
        const { id } = req.params;
        const generator = await Generator.findById(id);
        if (!generator) {
            return res.status(404).json({ message: "Generator not found" });
        }
        res.status(200).json(generator); // <-- return the fetched data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new generator
const createGen = async (req, res) => {
    try {
        const generator = await Generator.create(req.body);
        res.status(201).json({ message: "Generator created!", generator });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a generator
const updateGen = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGen = await Generator.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedGen) {
            return res.status(404).json({ message: "Generator not found" });
        }
        res.status(200).json(updatedGen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a generator
const deleteGen = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGen = await Generator.findOneAndDelete({genID: id}).select('genID');
        if (!deletedGen) {
            return res.status(404).json({ message: "Generator not found" });
        }
        res.status(200).json({ message: "Generator successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getGens,
    getGen,
    createGen,
    updateGen,
    deleteGen
};
