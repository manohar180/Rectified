import express from 'express';
const router = express.Router({ mergeParams: true }); 
import { addComment, getComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addComment).get(getComments);

export default router;