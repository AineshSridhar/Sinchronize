const StudyRoom = require("../models/studyRoom");

exports.createRoom = async (req, res) => {
  try {
    const newRoom = new StudyRoom(req.body);
    const saved = await newRoom.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await StudyRoom.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
