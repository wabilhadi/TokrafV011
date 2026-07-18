import { Router } from 'express';
import {
  getPortfolios, getPortfolioById, createPortfolio,
  updatePortfolio, deletePortfolio,
} from '../controllers/portfolio.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);

// Admin routes
router.post('/', authenticateJWT, upload.single('image'), createPortfolio);
router.put('/:id', authenticateJWT, upload.single('image'), updatePortfolio);
router.delete('/:id', authenticateJWT, deletePortfolio);

export default router;
