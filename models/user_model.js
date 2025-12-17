import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    FullName:{
        type : String,
        required : true,
        trim : true,
    },
    Email:{
        type : String,
        required : true,
        trim : true,
    },
    Password:{
        type : String,
        required : true,
    },
    ProfileImage:{
       url:{  type : String,default: ""},
       public_id:{type :String,default:""},
  },
Role:{
        type : String,
        enum:["patient","doctor","admin"],
    },
resetPasswordToken: String,
resetPasswordExpire: Date,
},
{
    timestamps:true,
}
);

const User = mongoose.model("User",userSchema);
export default User;