import { Router } from 'express';
import { getContents, upsertContent, bulkUpsertContent } from '../controllers/content.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getContents);
router.post('/', authenticateJWT, upsertContent);
router.post('/bulk', authenticateJWT, bulkUpsertContent);

export default router;
