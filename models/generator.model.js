const mongoose = require('mongoose');

const GeneratorSchema = mongoose.Schema(
    {
        genID: {
            type: String,
            required: true,
            default: ""
        },

        name: {
            type: String,
            required: true,
            default: ""
        },

        type: {
            type: String,
            required: true,
            default: ""
        },
       
    },
    {
        timestamps: true,
    }
);

const Generator = mongoose.model("Generator", GeneratorSchema);

module.exports = Generator;