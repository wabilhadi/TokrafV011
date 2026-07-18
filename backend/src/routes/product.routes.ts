import { Router } from 'express';
import {
  getProducts, getProductById, createProduct, updateProduct,
  deleteProduct, getAdminProducts,
} from '../controllers/product.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.get('/admin/all', authenticateJWT, getAdminProducts);
router.post('/', authenticateJWT, upload.array('images', 5), createProduct);
router.put('/:id', authenticateJWT, upload.array('images', 5), updateProduct);
router.delete('/:id', authenticateJWT, deleteProduct);

export default router;
