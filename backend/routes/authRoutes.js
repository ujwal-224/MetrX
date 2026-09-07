import express from 'express';
import { registerUser, loginUser, getMe, deleteUser, getInspectors } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/inspectors', getInspectors);
router.get('/me', protect, getMe);
router.delete('/users/:id', deleteUser);

export default router;
