import mongoose from "mongoose";

const studyRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["public", "private"],
    default: "public",
    required: true,
  },
  code: {
    type: String,
    required: false,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

studyRoomSchema.pre("validate", function (next) {
  if (this.type === "private" && !this.code) {
    this.code = generateCode();
  }
  next();
});

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const studyRoom = mongoose.model("studyRoom", studyRoomSchema);
export default studyRoom;
