import mongoose from 'mongoose';

const ratingSchema = mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Business' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    value: { type: Number, required: true }, 
  },
  { timestamps: true }
);

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;