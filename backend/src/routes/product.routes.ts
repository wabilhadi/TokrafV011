import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateJWT, createProduct);
router.put('/:id', authenticateJWT, updateProduct);
router.delete('/:id', authenticateJWT, deleteProduct);

export default router;
