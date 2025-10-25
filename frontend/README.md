# 🏢 BusinessHub - Modern Business Directory Frontend

A stunning, feature-rich React frontend for the Business Directory application. Discover, rate, and connect with local businesses through a modern, intuitive interface.

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure login and registration with JWT tokens
- User profile management with bio and profile pictures
- Follow/unfollow other users
- User discovery and social connections

### 🏪 **Business Discovery & Management**
- Beautiful business cards with hover animations
- Advanced search and filtering (category, rating, location)
- Sort by date, rating, likes, and name
- Create, edit, and delete businesses
- Image upload with preview
- Real-time like and save functionality

### ⭐ **Social Features**
- 5-star rating system with visual feedback
- Comment system with user attribution
- Like and save businesses
- Follow other users and see their businesses
- User profiles with business collections

### 🎨 **Modern UI/UX**
- Gradient backgrounds and glass effects
- Smooth animations and transitions
- Responsive design for all devices
- Custom scrollbars and loading states
- Toast notifications for user feedback
- Beautiful icons and typography

## 🛠 **Tech Stack**

- **React 18** - Modern frontend framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on port 5001

### Installation & Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:3000`

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Navigation with user menu
│   │   ├── BusinessCard.jsx # Beautiful business cards
│   │   └── LoadingSpinner.jsx
│   ├── contexts/           # State management
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── BusinessContext.jsx # Business operations
│   ├── pages/              # All application pages
│   │   ├── Home.jsx        # Hero section + business grid
│   │   ├── Login.jsx       # Authentication
│   │   ├── Register.jsx    # User registration
│   │   ├── BusinessDetails.jsx # Business view + comments
│   │   ├── CreateBusiness.jsx # Add new business
│   │   ├── EditBusiness.jsx   # Edit business
│   │   ├── Profile.jsx     # User profile management
│   │   ├── SavedBusinesses.jsx # Saved businesses
│   │   ├── Users.jsx       # User discovery
│   │   └── UserProfile.jsx # View other users
│   ├── App.jsx             # Main application
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles + animations
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🎯 **Key Features Breakdown**

### **🏠 Home Page**
- Hero section with gradient background
- Advanced filtering system
- Beautiful business grid with animations
- Real-time search and sorting

### **👤 User Management**
- Follow/unfollow system
- User discovery page
- Profile viewing with business collections
- Social connections

### **🏪 Business Features**
- Create businesses with image upload
- Edit and delete (owner only)
- Like and save functionality
- Rating and commenting system
- Advanced search and filters

### **🎨 Design System**
- Gradient backgrounds
- Glass morphism effects
- Smooth animations
- Responsive grid layouts
- Custom loading states
- Beautiful toast notifications

## 🔧 **Development**

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality
- ESLint for code linting
- Consistent component structure
- Proper error handling
- Responsive design patterns
- Accessibility considerations

## 🌐 **API Integration**

The frontend integrates with these backend endpoints:

- **Authentication**: `/api/users/login`, `/api/users/register`
- **Businesses**: `/api/businesses` (CRUD operations)
- **Comments**: `/api/businesses/:id/comments`
- **Ratings**: `/api/businesses/:id/ratings`
- **User Management**: `/api/users/profile`, `/api/users/:userId/follow`
- **Social Features**: `/api/users/save/:businessId`

## 📱 **Responsive Design**

- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly interactions**
- **Optimized for all screen sizes**

## 🚀 **Deployment**

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload `dist` contents to S3 bucket
- **Any static host**: Upload `dist` folder

## 🎨 **Customization**

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ... more shades
  }
}
```

### Animations
Custom animations are defined in `src/index.css`:
- `animate-fade-in`
- `animate-slide-up`
- `animate-bounce-in`

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

If you encounter any issues:
1. Check the browser console for errors
2. Ensure the backend server is running on port 5001
3. Verify all dependencies are installed
4. Check the network tab for API call failures

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies.**


