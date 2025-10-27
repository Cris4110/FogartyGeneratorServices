const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordRegex =  /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){2,}).{12,}$/;
//^(?=(?:.*[A-Z]){2,}) at least 2 uppercase letters
//(?=(?:.*[a-z]){2,}) at least 2 lowercase letters
//(?=(?:.*\d){2,}) at least 2 digits
//(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){2,}) at least 2 special chars and these are the authrized character
//.{12,}$ minimum total length of 12 characters


const AdminSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            default: ""
        },
        name: { //
            type: String,
            required: true,
            default: ""
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return passwordRegex.test(value);
                },
                message:
                "Password must be at least 12 characters long and include at least 2 uppercase letters, 2 lowercase letters, 2 numbers, and 2 special characters.",
            },
        },

        email: {
            type: String,
            required: true,
            default: ""
        },

        phoneNumber: {
            type: Number,
            required: true,
            default: 0
        },        
    },
    {
        timestamps: true,
    }
);

AdminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    try{
        const saltRounds = 12;
        const hashed = await bcrypt.hash(this.password, saltRounds);
        this.password = hashed;
        next();
    }catch (err){
        next(err);
    } 
});

//method to compare password during login 
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);    
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;