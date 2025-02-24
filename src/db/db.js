import mongoose from "mongoose";
import config from "../config/config.js";
 const connectToDB = ()=>{
    mongoose.connect(config.MONGO_URI ).then(()=>{
        console.log("DB connected")
    }).catch((error)=>{
        console.log(error)
    })
}
export default connectToDB