import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Business' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;