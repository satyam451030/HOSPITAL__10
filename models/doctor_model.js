import { request } from "express";
import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema({

    user:{
        type: mongoose>Schema>Types.ObjectId,
        ref:"User",
        required: true},

   department :{
        type : String,
        required : true,
       },

    qualification:{
        type:String,
        required:true,
       },

    experienceYears:{
        type:Number,
        required:true,
       },

    Age:{
        type:Number,

       },
      
    address:{
     type: String,
       },

    Gender:{
        type : String,
        enum:["Male",
            "Female",
            "Other"
        ],
    },

    Phone:{
        type : String,
    },

    BloodGroup:{
        type:String,
    },

    availableDays:[
        {
            type :String,
            enum:[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
        },
    ],

   availableTime : {
     type:String,
},

   appointment:[
    {
         type: mongoose>Schema>Types.ObjectId,
        ref:"Appointment",
            },
],
 
   bio:{
    type:String,
 },

   description:{
    type:String,
 },

},


{
    timestamps:true,
}
);

const Doctor = mongoose.model("Doctor",doctorSchema);
export default Doctor;