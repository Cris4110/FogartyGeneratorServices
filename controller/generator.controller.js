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
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const generatorData = {
            ...req.body,
            images: imagePaths // Stores the whole array (up to 10)
        };

        const generator = await Generator.create(generatorData);
        res.status(201).json({ message: "Generator created!", generator });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a generator
const updateGen = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        }
        
        const updatedGen = await Generator.findByIdAndUpdate(id, updateData, { new: true });
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

    const deleted = await Generator.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Generator not found" });
    }

    res.status(200).json({ message: "Generator deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    getGens,
    getGen,
    createGen,
    updateGen,
    deleteGen
};
