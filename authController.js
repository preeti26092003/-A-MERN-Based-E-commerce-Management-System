import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async(req,res) => {
    try{
        const {name,email,password,phone,address,answer} = req.body
        //validation
        if(!name){
            return res.send({error:'Name is required'});
        }
        if(!email){
            return res.send({messsage:'email is required'});
        }
        if(!password){
            return res.send({messsage:'Password is required'});
        }
        if(!phone){
            return res.send({messsage:'Phone is required'});
        }
        if(!address){
            return res.send({messsage:'Address is required'});
        }
        if(!answer){
            return res.send({messsage:'Answer is required'});
        }
        //check user
        const existingUser = await userModel.findOne({email})
        //existing user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'ALready Registered Please Login',
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save();

        res.status(201).send({
            success:true,
            message:'User register successfully',
            user,
        });


    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        });
    }
};
 
//POST LOGIN
export const loginController = async (req,res) => {
    try{
        const {email,password} = req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password',
            })
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered',
            })
        }

        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password',
            })
        }
        //token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role: user.role,

            },
            token,
        });

    } catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'error in login',
            error
        })
    }
};

//forgotPasswordController
export const forgotPasswordController = async (req,res) => {
    try{
        const {email,answer, newPassword} = req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'Answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'New Password is required'})
        }
        //check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong Email or Answer'
            });
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });

    }catch(error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            error
        })
    }
};

//test controler
export const testController = (req,res) =>{
   res.send("protected Route");
};