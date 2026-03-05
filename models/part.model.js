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

        Image_Url: {
            type: String,
            requried: false,
            default: ""
        },

        Image_Url2: {
            type: String,
            requried: false,
            default: ""
        },

        Image_Url3: {
            type: String,
            requried: false,
            default: ""
        },

        Description: {
            type: String,
            requried: false,
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