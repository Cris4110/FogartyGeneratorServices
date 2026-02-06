const Quote = require('../models/quote.model');

const getQuotes = async (req, res) =>{
    try {
        const quotes = await Quote.find({}).sort({ acknowledged: 1, createdAt: 1 });
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getQuote = async (req, res) =>{
    try {
        const {id} = req.params;
        const quote = await Quote.findById(id);
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const createQuote = async (req, res) => {
        try {
        const quote = await Quote.create(req.body);
        res.status(200).json({message: "New Quote Created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const updateQuote = async (req, res) => {
     try {
        const {id} = req.params;
        const quote = await Quote.findByIdAndUpdate(id, req.body);
        if(!quote){
            return res.status(404).json({message: "Quote not found"});
        }
        const updatedQuote = await Quote.findById(id);
        res.status(200).json(updatedQuote);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const deleteQuote = async (req, res) => {
     try {
        const {id} = req.params;
        const quote = await Quote.findByIdAndDelete(id, req.body);
        if(!quote){
            return res.status(404).json({message: "Quote not found."});
        }
        res.status(200).json({message:"Quote was successfully deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

const setAcknowledged = async (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledged } = req.body;
    const quote = await Quote.findByIdAndUpdate(
      id,
      { $set: { acknowledged: !!acknowledged } },
      { new: true }
    );
    if (!quote) return res.status(404).json({ message: "Quote not found" });
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    getQuotes,
    getQuote,
    createQuote,
    updateQuote,
    deleteQuote,
    setAcknowledged
};
