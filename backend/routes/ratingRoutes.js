import express from 'express';
const router = express.Router({ mergeParams: true });
import { addOrUpdateRating } from '../controllers/ratingController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrUpdateRating);

export default router;