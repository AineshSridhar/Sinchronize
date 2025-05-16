import mongoose from "mongoose";

const studyRoomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    members: [{type: String}],
    createdAt: {type: Date, default: Date.now},
})

const studyRoom = mongoose.model('studyRoom', studyRoomSchema);
export default studyRoom;