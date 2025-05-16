import express from 'express';
import {createRoom, getMyRooms, getRoomDetails, getRooms, joinRoom} from "../controllers/studyRoomController.js";
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/', protect, createRoom);
router.get('/', protect, getRooms);
router.get('/myrooms', protect, getMyRooms);
router.get('/rooms/:id', protect, getRoomDetails);
router.put('/:roomId/join', protect, joinRoom);

export default router;
