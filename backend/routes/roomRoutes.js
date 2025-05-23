import express from 'express';
import {createRoom, getMyRooms, getRoom, getRooms, joinPrivateRoom, joinRoom} from "../controllers/studyRoomController.js";
import {getUsers} from '../controllers/studentController.js'
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/', protect, createRoom);
router.get('/', protect, getRooms);
router.get('/myrooms', protect, getMyRooms);
router.get('/info/:id', protect, getRoom);
router.get('/:id/students', protect, getUsers);
router.put('/:roomId/join', protect, joinRoom);
router.post('/join', protect, joinPrivateRoom);
// router.put('/:roomId/start-session')

export default router;
