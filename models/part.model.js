const mongoose = require('mongoose');

const PartSchema = mongoose.Schema(
    {
        partID: {
            type: String,
            required: true,
            default: ""
        },

        type: {
            type: String,
            required: true,
            default: ""
        },

        cost: {
            type: Number,
            required: true,
            default: 0.00,
            min: 0,
            get: v => (v/1).toFixed(2),
            set: v => parseFloat(v.toFixed(2))
        },
       
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true }
    }
);

const Part = mongoose.model("Part", PartSchema);

module.exports = Part;