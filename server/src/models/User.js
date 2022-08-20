import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    
    
    name: {type: String, required:true, unique: true},
    id: {type: String, required:true, unique: true},
    avatarUrl: String,
    certifications: [{type: mongoose.Schema.Types.ObjectId, ref:"Certification"}],
    


});



const User = mongoose.model("User", userSchema);
export default User;