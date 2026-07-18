import { Router } from 'express';
import { createOrder, getOrders } from '../controllers/order.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createOrder);
router.get('/', authenticateJWT, getOrders);

export default router;
