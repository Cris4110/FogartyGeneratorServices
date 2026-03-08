import mongoose from 'mongoose';

const PartSchema = mongoose.Schema(
    {
        partID: {
            type: String,
            required: false,
            default: ""
        },

        Part_Name: {
            type: String,
            required: true,
            default: ""
        },

        Stock: {
            type: Number,
            required: true,
            default: ""
        },


        images: {
            type: [String],
            required: true,
            default: []
        },

        Description: {
            type: String,
            required: false,
            default: ""
        },
       
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true }
    }
);

const Part = mongoose.model("Part", PartSchema);

export default Part;