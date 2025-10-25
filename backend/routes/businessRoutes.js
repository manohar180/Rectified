import express from 'express';
const router = express.Router();
import {
  createBusiness, getBusinesses, likeBusiness, getBusinessById, updateBusiness, deleteBusiness,
} from '../controllers/businessController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';

router.route('/').get(getBusinesses).post(protect, upload.single('image'), createBusiness);

router.route('/:id')
  .get(getBusinessById)
  .delete(protect, deleteBusiness)
  .put(protect, upload.single('image'), updateBusiness);

router.route('/:id/like').put(protect, likeBusiness);

export default router;