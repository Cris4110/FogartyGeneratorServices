const mongoose = require('mongoose');

const GeneratorSchema = mongoose.Schema(
    {
        genID: {
            type: String,
            required: false,
            default: ""
        },

        Serial_Number: {
            type: String,
            required: true,
            default: ""
        },

        name: {
            type: String,
            required: true,
            default: ""
        },

        Description : {
            type: String,
            required: true,
            default: ""
        },

        Stock : {
            type: Number,
            required: true,
            default: ""
        },

        Image_Url: {
            type: Array,
            requried: false,
            default: ""
        },
       
        Image_Url2: {
            type: Array,
            requried: false,
            default: ""
        },

        Image_Url3: {
            type: Array,
            requried: false,
            default: ""
        },
        
    },
    {
        timestamps: true,
    }
);

const Generator = mongoose.model("Generator", GeneratorSchema);

module.exports = Generator;