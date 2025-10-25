import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

dotenv.config();
connectDB();
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/businesses/:id/comments', commentRoutes);
app.use('/api/businesses/:id/ratings', ratingRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running on port ${PORT}`));