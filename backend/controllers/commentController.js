import Comment from '../models/commentModel.js';
import Business from '../models/businessModel.js';

const addComment = async (req, res) => {
  const { text } = req.body;
  const business = await Business.findById(req.params.id);

  if (business) {
    const comment = new Comment({
      text,
      user: req.user._id,
      username: req.user.username,
      business: req.params.id,
    });

    const createdComment = await comment.save();

    business.numComments = business.numComments + 1;
    await business.save();

    res.status(201).json(createdComment);
  } else {
    res.status(404).json({ message: 'Business not found' });
  }
};

const getComments = async (req, res) => {
  const comments = await Comment.find({ business: req.params.id });
  res.json(comments);
}

export { addComment, getComments };