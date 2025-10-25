import Business from '../models/businessModel.js';
import Comment from '../models/commentModel.js';
import Rating from '../models/ratingModel.js';

// @desc    Get all businesses with filtering, searching, and sorting
// @route   GET /api/businesses
// @access  Public
const getBusinesses = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const ratingFilter = req.query.minRating
      ? { averageRating: { $gte: Number(req.query.minRating) } }
      : {};

    const filters = { ...keyword, ...ratingFilter };

    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const sortObject = { [sortBy]: order };

    if (sortBy === 'likes') {
      const businesses = await Business.aggregate([
        { $match: filters },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: order } },
      ]);
      await Business.populate(businesses, { path: 'owner', select: 'username' });
      return res.json(businesses);
    }

    const businesses = await Business.find(filters)
      .populate('owner', 'username')
      .populate('savedBy', 'username')
      .sort(sortObject);
    
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new business
// @route   POST /api/businesses
// @access  Private
const createBusiness = async (req, res) => {
    const { name, description, category, location } = req.body;
    const imageUrl = req.file ? req.file.path : null; 
    if (!name || !description || !category || !location) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }
    const business = new Business({
        name, description, category, location,
        owner: req.user._id,
        images: imageUrl ? [imageUrl] : [],
    });
    const createdBusiness = await business.save();
    res.status(201).json(createdBusiness);
};

// @desc    Get a single business by ID
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'username')
      .populate('savedBy', 'username');
    if (business) {
      res.json(business);
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a business
// @route   PUT /api/businesses/:id
// @access  Private (Owner only)
const updateBusiness = async (req, res) => {
  const { name, description, category, location } = req.body;
  const business = await Business.findById(req.params.id);

  if (business) {
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    business.name = name || business.name;
    business.description = description || business.description;
    business.category = category || business.category;
    business.location = location || business.location;
    if (req.file) {
      business.images = [req.file.path];
    }
    const updatedBusiness = await business.save();
    res.json(updatedBusiness);
  } else {
    res.status(404).json({ message: 'Business not found' });
  }
};

// @desc    Delete a business
// @route   DELETE /api/businesses/:id
// @access  Private (Owner only)
const deleteBusiness = async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (business) {
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await business.deleteOne();
    await Comment.deleteMany({ business: req.params.id });
    await Rating.deleteMany({ business: req.params.id });
    res.json({ message: 'Business removed' });
  } else {
    res.status(404).json({ message: 'Business not found' });
  }
};

// @desc    Like or Unlike a business
// @route   PUT /api/businesses/:id/like
// @access  Private
const likeBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    const alreadyLiked = business.likes.find((like) => like.toString() === req.user._id.toString());
    if (alreadyLiked) {
      business.likes = business.likes.filter((like) => like.toString() !== req.user._id.toString());
    } else {
      business.likes.push(req.user._id);
    }
    await business.save();
    res.json({ message: 'Like status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export {
  getBusinesses,
  createBusiness,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  likeBusiness,
};