import { Router } from 'express';
import { getUsers, toggleUserVerification, getStats } from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, getUsers);
router.get('/stats', authenticateJWT, getStats);
router.put('/:id/toggle-verify', authenticateJWT, toggleUserVerification);

export default router;
