import { useImperativeHandle } from "react";
import UserRoomActivity from "../models/UserRoomActivity.js";

export const getUsers = async(req, res) => {
    console.log('req.params:', req.params);
    try{
        const id = req.params.id;
        const students = await UserRoomActivity.find({roomId:id})
        res.status(200).json(students);
    } catch (err){
        console.error(err);
        res.status(500).json({message: "Failed to fetch students"});
    }
};

export const updateUserTime = async(userId, roomId, timeInSec) => {
    const dateKey = new Date().toISOString().slice(0, 10);
    const minutes = Math.floor(timeInSec/60);
    await UserRoomActivity.updateOne(
        {userId, roomId},
        {$inc: {[`dailyStudy.${dateKey}`]: minutes, timeStudied: minutes}},
        {upsert: true}
    );
};