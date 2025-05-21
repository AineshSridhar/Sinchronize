import mongoose from "mongoose";
import studyRoom from "../models/studyRoom.js";
import UserRoomActivity from "../models/UserRoomActivity.js";

export const createRoom = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const room = await studyRoom.create([{...req.body, members: [req.user._id]}], {session});
        const roomActivity = await UserRoomActivity.create([{userId: req.user._id, roomId: room[0]._id}], {session});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({room: room[0], roomActivity});
    } catch (err){
        await session.abortTransaction();
        session.endSession();

        console.error(err);
        res.status(400).json({err: err.message});
    }
};

export const getMyRooms = async(req, res) => {
    try{
        const rooms = await studyRoom.find({members: req.user._id});
        res.status(200).json(rooms);
    } catch (err){
        console.error(err);
        res.status(500).json({message: "Failed to fetch rooms"});
    }
};

export const getRoom = async(req, res) => {
    try{
        const {id} = req.params;
        const students = await studyRoom.find({roomId: id});
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({error: "Failed to fetch room activity"});
    }
}

export const getRooms = async(req, res) => {
    try{
        const rooms = await studyRoom.find();
        res.json(rooms);
    } catch (err){
        console.error(err);
        res.status(400).json({message: err.message});
    }
};

export const joinRoom = async(req, res) => {
    try{
        const {roomId} = req.params;
        const {member} = req.body;
    } catch (err){
        
    }
}