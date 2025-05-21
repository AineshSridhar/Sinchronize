import mongoose from 'mongoose';

const userRoomActivitySchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    roomId: {type: mongoose.Schema.Types.ObjectId, ref: "StudyRoom", required: true},
    timeStudiedHistory: [{
        date: {type: String},
        duration: {type: Number, default: 0}    
    }],
    currentSessionStart: {type:Date, default: null},
    questionsSolved: {type: Number, default: 0},
    streak: {type: Number, default: 0}
});

export default mongoose.model('UserRoomActivity', userRoomActivitySchema);