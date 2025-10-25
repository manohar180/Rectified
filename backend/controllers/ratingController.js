import Rating from '../models/ratingModel.js';
import Business from '../models/businessModel.js';


const addOrUpdateRating = async (req, res) => {
  const { value } = req.body;
  const businessId = req.params.id;
  const userId = req.user._id;

  const business = await Business.findById(businessId);
  if (!business) {
    return res.status(404).json({ message: 'Business not found' });
  }

  let rating = await Rating.findOne({ business: businessId, user: userId });

  if (rating) {
    rating.value = value;
    await rating.save();
  } else {
    rating = new Rating({
      value,
      user: userId,
      business: businessId,
    });
    await rating.save();
  }


  const ratings = await Rating.find({ business: businessId });
  const totalRating = ratings.reduce((acc, item) => item.value + acc, 0);
  business.numRatings = ratings.length;
  business.averageRating = totalRating / ratings.length;
  
  await business.save();

  res.status(201).json({ message: 'Rating added/updated', averageRating: business.averageRating });
};

export { addOrUpdateRating };