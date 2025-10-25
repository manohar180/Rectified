import express from 'express';
const router = express.Router();
import { 
  testEndpoint,
  registerUser, 
  authUser, 
  getAllUsers,
  getUserPosts, 
  getUserProfile, 
  followUser, 
  unfollowUser,
  getSavedBusinesses,
  saveBusiness,
  unsaveBusiness,
  updateProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/test', testEndpoint);
router.get('/', getAllUsers);
router.post('/register', registerUser);
router.post('/login', authUser);

// Profile routes
router.route('/profile/posts').get(protect, getUserPosts);
router.route('/profile/saved').get(protect, getSavedBusinesses);
router.route('/profile').put(protect, updateProfile);

// Follow/Unfollow routes
router.route('/:userId/follow').put(protect, followUser);
router.route('/:userId/unfollow').put(protect, unfollowUser);

// User profile routes (must be after other routes to avoid conflicts)
router.route('/:username').get(getUserProfile);

// Save/Unsave business routes
router.route('/save/:businessId').put(protect, saveBusiness);
router.route('/unsave/:businessId').put(protect, unsaveBusiness);

export default router;