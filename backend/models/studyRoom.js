const mongoose = require('mongoose');

const studyRoomSchema = new mongoose.schema({
    name: {type: String, required: true},
    domain: {type: String, required: true},
    members: [{type: String}],
    createdAt: {type: Date, default: Date.now},
})

const studyRoom = mongoose.model('studyRoom', studyRoomSchema);
export default studyRoom;