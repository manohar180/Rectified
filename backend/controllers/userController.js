import User from '../models/userModel.js';
import Business from '../models/businessModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Test endpoint
// @route   GET /api/users/test
// @access  Public
const testEndpoint = async (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get user's own posts for their private profile
// @route   GET /api/users/profile/posts
// @access  Private
const getUserPosts = async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.user._id })
      .populate('owner', 'username')
      .sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -email')
      .populate('followers', 'username')
      .populate('following', 'username')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a user's public profile by username
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username')
      .populate('following', 'username');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const businesses = await Business.find({ owner: user._id })
      .populate('owner', 'username')
      .sort({ createdAt: -1 });
      
    res.json({ user, businesses });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Follow / Unfollow a user
// @route   PUT /api/users/:userId/follow
// @access  Private
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (userToFollow.id === currentUser.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Check if the current user is already following the target user
    if (currentUser.following.includes(userToFollow.id)) {
      // Unfollow logic
      currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow.id.toString());
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUser.id.toString());
    } else {
      // Follow logic
      currentUser.following.push(userToFollow.id);
      userToFollow.followers.push(currentUser.id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ 
      message: 'Follow status updated successfully',
      isFollowing: currentUser.following.includes(userToFollow.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Unfollow a user
// @route   PUT /api/users/:userId/unfollow
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following/followers arrays
    currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow.id.toString());
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser.id.toString());

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's saved businesses
// @route   GET /api/users/profile/saved
// @access  Private
const getSavedBusinesses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedBusinesses',
      populate: {
        path: 'owner',
        select: 'username'
      }
    });
    
    res.json(user.savedBusinesses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Save a business
// @route   PUT /api/users/save/:businessId
// @access  Private
const saveBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId);
    const user = await User.findById(req.user._id);

    if (!business || !user) {
      return res.status(404).json({ message: 'Business or user not found' });
    }

    // Check if already saved
    if (user.savedBusinesses.includes(business._id)) {
      return res.status(400).json({ message: 'Business already saved' });
    }

    // Add to saved businesses
    user.savedBusinesses.push(business._id);
    business.savedBy.push(user._id);
    business.numSaves += 1;

    await user.save();
    await business.save();

    res.json({ message: 'Business saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Unsave a business
// @route   PUT /api/users/unsave/:businessId
// @access  Private
const unsaveBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId);
    const user = await User.findById(req.user._id);

    if (!business || !user) {
      return res.status(404).json({ message: 'Business or user not found' });
    }

    // Remove from saved businesses
    user.savedBusinesses = user.savedBusinesses.filter(id => id.toString() !== business._id.toString());
    business.savedBy = business.savedBy.filter(id => id.toString() !== user._id.toString());
    business.numSaves = Math.max(0, business.numSaves - 1);

    await user.save();
    await business.save();

    res.json({ message: 'Business unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { bio, profilePicture } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    const responseData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following
    };
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export {
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
};