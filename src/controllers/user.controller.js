import userModel from "../models/user.js";
import { validationResult } from "express-validator";
import * as userService from "../services/user.service.js"
import redis from "../services/redis.service.js";
export const creatUserController = async(req,res)=>{
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
try{
    const {username ,email,password} = req.body
    // console.log(req.body)
const user = await userService.createUser({username ,email,password})
const token = user.generateToken()
res.status(201).json({user,token})

}catch(error){
    console.log(error)
    console.log(error);
    res.status(500).send(error.message);
}
}

export const logincontroler  = async (req,res) =>{
    const errors  = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
        
    }
    try{
        const {email,password} = req.body
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).send("user does not exist")
        }
const token = user.generateToken()
res.status(200).json({user,token})
const decoded = userModel
    }catch(error){
console.log(error)
res.status(400).send(error.message)
    }
}

export const logoutcontroller = async(req,res) =>{
    const timeRemainingForToken = req.tokenData.exp * 1000 - Date.now()
    console.log("Token Data:", req.tokenData);
    
    if (!req.tokenData.token) {
        return res.status(400).send("Token missing");
    }

    await redis.set(`blacklist:${req.tokenData.token}`, "true" ,"EX",Math.floor(timeRemainingForToken/1000));
    res.send("Logout successful");


}