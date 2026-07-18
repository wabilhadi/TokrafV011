import { Router } from 'express';
import { getReviews, createReview } from '../controllers/review.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/:productId', getReviews);
router.post('/:productId', upload.single('media'), createReview);

export default router;
