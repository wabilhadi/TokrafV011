import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Only admin login is supported now
router.post('/login', login);
router.get('/me', authenticateJWT, getMe);

export default router;
