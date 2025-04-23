const mongoose = require("mongoose");

const studyRoomSchema = new mongoose.Schema({
  name: String,
  members: [String],
  topics: [
    {
      title: String,
      completedBy: [String],
      week: Number,
    }
  ],
  discussions: [
    {
      user: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("StudyRoom", studyRoomSchema);
