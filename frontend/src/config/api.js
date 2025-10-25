// API Configuration
// For production, replace 'your-backend-name' with your actual Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-backend-name.onrender.com'  // TODO: Replace with your actual Render URL
    : 'http://localhost:5001'
  )

export default API_BASE_URL
