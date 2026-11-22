import express from 'express';
import { registerAdmin, loginAdmin, getMe, changeAdminPassword } from '../controllers/auth.controller.js';
import { protectAdmin } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimits.js';

const router = express.Router();

router.post('/register', authLimiter, registerAdmin);
router.post('/login', authLimiter, loginAdmin);
router.get('/me', protectAdmin, getMe);
router.post('/change-password', protectAdmin, authLimiter, changeAdminPassword);

export default router;
