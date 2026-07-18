import { Router } from 'express';
import { submitContact, getContactMessages, markContactRead, deleteContact } from '../controllers/contact.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/', submitContact);
router.get('/', authenticateJWT, getContactMessages);
router.put('/:id/read', authenticateJWT, markContactRead);
router.delete('/:id', authenticateJWT, deleteContact);

export default router;
