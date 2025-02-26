import userModel from "../models/user.js"
export const createUser = async ({username, email,password,})=>{
    if(!username || !email || !password){
        throw new Error("All fields are required username ,email,password")
    }
    const isUserAlreadyExist = await userModel.findOne({
$or: [{username},{email}],
    })
    if(isUserAlreadyExist){throw new Error('username already exists')}
    const hasPassword = await userModel.hasPassword(password)
    const user = new userModel({
        username,
        email,
        password:hasPassword
    })
    await user.save()
    delete user._doc.password
    return user
}
export const loginUser = async ({email,password})=>{
    const user = await userModel.findOne({
        email,
    })
    if(!user){
    return  res.status(401).send("Invalid Credential")
    }
    const isPasswordCorrect = await user.comaprePassword(password)
if(!isPasswordCorrect){
return res.status(401).send("Invalid Credential")
}
delete user._doc.password;
return user
}