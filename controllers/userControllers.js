import { userValidation, userValidationForLogin } from "../validator/userValidator.js";
import bcrypt from "bcryptjs";
import { userModel } from "../models/userSchema.js";
import { generateToken } from "../utils/generateToken.js";
 export const getHome = (req, res) => {
  res.send("Welcome to my Backend API!");
};
export const getAbout = (req, res) => {
  res.send("My name is Abdulrasheed. I am a backend developer learning Node.js.");
};
export const getGoals = (req, res) =>{
    res.send("My goals are to master express and API's")
}


 export const postUser = async(req, res) => {
    const{username, email, password} = req.body
   try{
     if(email !=="" && password!==""){

        const {error} = userValidation.validate({
            username,
            email,
            password
        })
        if(error){
            return res.status(400).json({
                message:error.details[0].message
            })
        }
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message:`User with email ${email} already exists, please login instead or create a new account!`
            })
        }
        const newUser = await userModel.create({
            username,
            email,
            password
        })
        const token = await generateToken(newUser._id)
        res.cookie("token", token, {
            httpOnly: process.env.
            NODE_ENV === "production", 
            strict:"lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        return res.status(201).json({
            message: "User Created Successfully",
            data: newUser
        })
         }
         res.status(400).json({
            messgae:"provide email and password"
         })
   }catch(err){
    if(err instanceof Error){
        console.error(err.message)
        throw new Error(err.message)
    }
   }
} 
export const Login = async (req, res) => {
    const {email, password} = req.body
    try{
      const {error} = userValidationForLogin.validate({
        email,
        password
      })
      if(error){
        return res.status(400).json({
            message: error.details[0].message
        })
      }
      const existingUser = await userModel.find({email})

      if(!existingUser){
        return res.status(404).json({
            message: `user with email ${email} not found`
        })
      }
      const isPasswordValid = await bcrypt.compare(password, existingUser.password)
      if (!isPasswordValid){
        return res.status(401).json({
            message: "invalid Credentials"
        })
      }
      return res.status(200).json({
        message:"Login succesful", data: existingUser
      })
       }catch (err){
       
    }
}
export const getAllUsers = async (req, res) => {
    try{
  const users = await userModel.find().select("-password")

  if (!users) {
    return res.status(404).json({
        message: "No users found"
    })
  }
  return res.status(201).json({
    message: "users retreived successfullly",
    data: users
  })
    }catch (err){
      if(err instanceof Error) {
        throw new Error(err.message)
        console.error(err)
      }
    }
}
export const getSingleUser = async (req, res) =>{
    const {id} = req.params
    try{
        const user = userModel.findById(id).select("-password")
        if(!user) {
            return res.status(404).json({
                message: `user with id: ${id} not found`
            })
        }
        return res.statues(200).json({
            message: "user retreived successfully",
            data: user
        })
    } catch (err){
        if (err instanceof Error){
            console.error(err)
            throw new Error(err.message)
        }
    }
}

export const deleteSingle = async (req, res) =>{
    const {id} = req.params
    try{
        const user = await userModel.findByIdAndDelete(id)
        
        if (!user){
            return res.status(404).json({
                message: `user with id: ${id} not found`
            })
        }
        return res.status(200).json({
            message:` user deleted successfully`,
            data: user
        })
    }catch(err){
    if(err instanceof Error){
        console.error(err)
        throw new Error(err.message)
    }
    }
}

export const logOut = (req, res) =>{
    try{
        res.clearCookie("token", {
            httpOnly:true,
            secure: process.env.NODE_ENV --- "production",
            sameSite: "lax",
        })
        return res.status(200).json({
            message: "logout successful"
        })
    }catch(err){
        console.error(err)
    }
}