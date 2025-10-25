import mongoose from 'mongoose';

const businessSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    averageRating: { type: Number, required: true, default: 0 },
    numRatings: { type: Number, required: true, default: 0 },
    numComments: { type: Number, required: true, default: 0 },
    numSaves: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);
export default Business;