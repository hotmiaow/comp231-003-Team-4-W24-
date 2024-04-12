import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {type:String, required:true, unique:true},
  password: {type:String, require:true},
  name: {type:String},
  phone: {type:Number}
})

export default mongoose.model("User", UserSchema);
