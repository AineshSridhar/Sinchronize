import studyRoom from "../models/studyRoom.js";
import UserRoomActivity from "../models/UserRoomActivity.js";

export const createRoom = async(req, res) => {
    try{
        const room = await studyRoom.create({...req.body, members: [req.user._id]});
        res.status(201).json(room);
    } catch (err){
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

export const getRoomDetails = async(req, res) => {
    try{
        const roomId = req.params.id;
        const response = await UserRoomActivity.find({roomId});
        res.status(200).json(activity);
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