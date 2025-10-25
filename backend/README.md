# BusinessHub Backend

A Node.js/Express backend for the BusinessHub application with MongoDB and JWT authentication.

## Features

- User authentication (register/login)
- Business CRUD operations
- User following system
- Business ratings and comments
- Image upload with Cloudinary
- Search and filtering
- Dark mode support

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/businesshub

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5001
NODE_ENV=development

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your actual values
```

3. Start the development server:
```bash
npm run dev
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Set the following environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., https://your-app.vercel.app)

3. Deploy!

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/:userId/follow` - Follow/unfollow user
- `PUT /api/users/profile` - Update user profile

### Businesses
- `GET /api/businesses` - Get all businesses (with filtering)
- `POST /api/businesses` - Create business
- `GET /api/businesses/:id` - Get business by ID
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business
- `PUT /api/businesses/:id/like` - Like/unlike business

### Comments & Ratings
- `GET /api/businesses/:id/comments` - Get business comments
- `POST /api/businesses/:id/comments` - Add comment
- `GET /api/businesses/:id/ratings` - Get business ratings
- `POST /api/businesses/:id/ratings` - Add rating

