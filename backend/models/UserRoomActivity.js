import mongoose from "mongoose";

const userRoomActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyRoom",
    required: true,
  },
  timeStudiedHistory: [
    {
      date: { type: String, required: true },
      sessions: [
        {
          start: { type: Date, required: true },
          end: { type: Date, required: true },
          duration: { type: Number, required: true },
        },
      ],
    },
  ],

  dailyStudy: {
    type: Map,
    of: Number,
    default: {},
  },

  currentSessionStart: { type: Date, default: null },
  questionsSolved: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
});

export default mongoose.model("UserRoomActivity", userRoomActivitySchema);
