import express from 'express';
import {createRoom, getMyRooms, getRooms, joinRoom} from "../controllers/studyRoomController.js";
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/', protect, createRoom);
router.get('/', protect, getRooms);
router.get('/myrooms', protect, getMyRooms);
router.put('/:roomId/join', protect, joinRoom);

export default router;
