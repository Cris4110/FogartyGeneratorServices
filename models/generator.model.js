import mongoose from 'mongoose';

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

        images: {
            type: [String],
            required: true,
            default: []
        },
        
    },
    {
        timestamps: true,
    }
);

const Generator = mongoose.model("Generator", GeneratorSchema);

export default Generator;