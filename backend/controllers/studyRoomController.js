import studyRoom from "../models/studyRoom.js";

export const createRoom = async(req, res) => {
    try{
        const room = await studyRoom.create(req.body);
        res.status(201).json(studyRoom);
    } catch (err){
        console.error(err);
        res.status(400).json({err: err.message});
    }
};

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