import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

export const registerUser = async(req, res) => {
    const {name, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exists"});

        const user = await User.create({name, email, password});
        const token = generateToken(user._id);
        res.status(201).json({token, user: {id: user._id, name: user.name, email: user.email}});
    } catch (err){
        res.status(500).json({error: err.message});
    }
};

export const loginUser = async(req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if (!user || !(await user.matchPassword(password))){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = generateToken(user._id);
        res.json({token, user: {id: user._id, name: user.name, email: user.email}})
    } catch (err){
        res.status(500).json({error: err.message});
    }
};
