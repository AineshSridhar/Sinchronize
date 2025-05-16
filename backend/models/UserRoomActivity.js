import mongoose from 'mongoose';

const userRoomActivitySchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    roomId: {type: mongoose.Schema.Types.ObjectId, ref: "StudyRoom", required: true},
    timeStudied: {type: Number, default: 0},
    questionsSolved: {type: Number, default: 0},
    lastActive: {type: Date, default: Date.now()},
    streak: {type: Number, default: 0}
});

export default mongoose.model('UserRoomActivity', userRoomActivitySchema);