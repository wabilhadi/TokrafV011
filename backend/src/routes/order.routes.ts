import { Router } from 'express';
import { createCheckoutOrder } from '../controllers/order.controller';

const router = Router();

// POST /api/orders/checkout
router.post('/checkout', createCheckoutOrder);

export default router;
