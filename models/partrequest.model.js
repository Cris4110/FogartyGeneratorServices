import mongoose from 'mongoose';

const PartRequestSchema  = mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
            default: ""
        },

        email: {
            type: String,
            required: true,
            default: ""
        },

        phoneNumber: {
            type: Number,
            required: true,
            default: ""
        },
        partName: {
            type: String,
            required: true,
            default: ""
        },

        AdditionalInformation: {
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

const Partrequest = mongoose.model("Partrequest", PartRequestSchema);

export default Partrequest;