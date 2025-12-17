import mongoose from "mongoose";


const patientSchema = new mongoose.Schema({

    user:{type: mongoose>Schema>Types.ObjectId,ref:"User",required: true},
    Age:{
        type : Number,
       },

    Gender:{
        type : String,
        enum:["Male","Female","Other"],
    },
    Phone:{
        type : String,
    },
    BloodGroup:{
        type:String,
    },

},
{
    timestamps:true,
}
);

const Patient = mongoose.model("Patient",patientSchema);
export default Patient;