import { useImperativeHandle } from "react";
import UserRoomActivity from "../models/UserRoomActivity.js";

export const getUsers = async (req, res) => {
  console.log("req.params:", req.params);
  try {
    const id = req.params.id;
    const students = await UserRoomActivity.find({ roomId: id }).populate("userId", "name")
      .lean();
    const transformed = students.map((student) => ({
      ...student,
      userId: {
        id: student.userId._id.toString(),
        name: student.userId.name,
      },
    }));

    res.status(200).json(transformed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

export const saveUserStudySession = async (userId, roomId, start, end) => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const userActivity =
      (await UserRoomActivity.findOne({ userId, roomId })) ||
      new UserRoomActivity({ userId, roomId, dailyStudy: new Map() });

    let current = startDate;
    let totalDuration = 0;

    while (current < endDate) {
      const nextDay = new Date(current);
      nextDay.setHours(24, 0, 0, 0);

      const sessionEnd = endDate < nextDay ? endDate : nextDay;
      const duration = (sessionEnd - current) / 1000;

      totalDuration += duration;

      const dateKey = current.toISOString().split("T")[0];

      const existing = userActivity.dailyStudy.get(dateKey) || 0;
      userActivity.dailyStudy.set(dateKey, existing + duration);

      const session = {
        start: new Date(current),
        end: new Date(sessionEnd),
        duration,
      };
      const existingHistory = userActivity.timeStudiedHistory.find(
        (h) => h.date === dateKey
      );
      if (existingHistory) {
        if (!Array.isArray(existingHistory.sessions)) {
          existingHistory.sessions = [];
        }
        existingHistory.sessions.push(session);
      } else {
        userActivity.timeStudiedHistory.push({
          date: dateKey,
          sessions: [session],
        });
      }
      current = nextDay;
    }
    await userActivity.save();
  } catch (err) {
    console.error("Error saving study session", err);
  }
};

export const getTodayStudyTime = async (req, res) => {
  const { userId, roomId } = req.params;
  const today = new Date().toISOString().split("T")[0];

  try {
    const activity = await UserRoomActivity.findOne({ userId, roomId });
    const seconds = activity?.dailyStudy.get(today) || 0;
    res.status(200).json({ time: Math.floor(seconds) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch today's time" });
  }
};
