import Return from "../models/returns.model.js";

export const getReturn  = async (req, res) =>{
 try {
        const part = await Return.find({});
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

// CREATE return
export const createReturn = async (req, res) => {
  try {
    const {
      userID,
      name,
      email,
      generatorModel,
      serialNumber,
      condition,
      reason,
    } = req.body;

    const newReturn = await Return.create({
      userID,
      name,
      email,
      generatorModel,
      serialNumber,
      condition,
      reason,
      status: "pending",
    });

    res.status(201).json({
      message: "Return application submitted",
      data: newReturn
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};