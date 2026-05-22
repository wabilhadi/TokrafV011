import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getAdminProducts } from '../controllers/product.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Public routes (hanya ACTIVE products)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes (semua products + CRUD)
router.get('/admin/all', authenticateJWT, getAdminProducts);
router.post('/', authenticateJWT, createProduct);
router.put('/:id', authenticateJWT, updateProduct);
router.delete('/:id', authenticateJWT, deleteProduct);

export default router;
