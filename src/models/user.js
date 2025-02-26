import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "username is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [3, "username must be at least 3 characters"],
    maxLength: [15, "Username must be at most 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    trim: true,
    lowercase: true,
    minLength: [6, "username must be at least 3 characters"],
    maxLength: [40, "Username must be at most 20 characters"],
  },
  profileImage: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1740417042~exp=1740420642~hmac=f5bf9b0c82e9eedba49ce27b9e76322c97a2e0e4c620ce15382e04a8346b09a7&w=1480D",
  },
  password: {
    type: String,
  },
});
userSchema.methods.generateToken = function () {
    return jwt.sign(
      { _id: this._id, username: this.username, email: this.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN } // Ensure this is a valid value
    );
  };
  
userSchema.statics.verifyToken = function (token){
    if(!token){
throw new Error("token is required")
    }
    return jwt.verify(token,config.JWT_SECRET)
}
userSchema.statics.hasPassword = async function name(password) {
    if(!password){
        throw new Error("password is required")
    }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, 10);
};
userSchema.methods.comaprePassword = async function (password) {
    if(!password){
        throw new Error('password is required')
    }
    if(!this.password){
        throw new Error('password is required')
    }
  return bcrypt.compare(password, this.password);
};
const userModel = mongoose.model('user',userSchema)
export default userModel 