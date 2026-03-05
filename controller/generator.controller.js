import Generator from '../models/generator.model.js';

// Get all generators
export const getGens = async (req, res) => {
    try {
        const generators = await Generator.find({});
        res.status(200).json(generators); // <-- return the fetched data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single generator by ID
export const getGen = async (req, res) => {
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
export const createGen = async (req, res) => {
    try {
        const generator = await Generator.create(req.body);
        res.status(201).json({ message: "Generator created!", generator });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a generator
export const updateGen = async (req, res) => {
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
export const deleteGen = async (req, res) => {
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


