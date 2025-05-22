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

export const saveUserStudySession = async (userId, roomId, start, end, duration) => {
  const today = new Date().toISOString().split('T')[0];
  const session = { start, end, duration };
  console.log("darshan dediye apne");
  const userActivity = await UserRoomActivity.findOne({ userId, roomId });

  if (!userActivity) {
    console.log("It detect not present, will create")
    await UserRoomActivity.create({
      userId,
      roomId,
      timeStudiedHistory: [{ date: today, sessions: [session] }]
    });
  } else {
    let history = userActivity.timeStudiedHistory;
    const existingDay = history.find(d => d.date === today);
    if (existingDay) {
      existingDay.sessions.push(session);
    } else {
      history.push({ date: today, sessions: [session] });
    }
    await userActivity.save();
  }
};
