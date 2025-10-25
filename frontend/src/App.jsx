import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { BusinessProvider } from './contexts/BusinessContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './contexts/UserContext'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BusinessDetails from './pages/BusinessDetails'
import Profile from './pages/Profile'
import CreateBusiness from './pages/CreateBusiness'
import EditBusiness from './pages/EditBusiness'
import SavedBusinesses from './pages/SavedBusinesses'
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <UserProvider>
            <Router>
            <div className="min-h-screen gradient-bg">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/business/:id" element={<BusinessDetails />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/create-business" element={<CreateBusiness />} />
                  <Route path="/edit-business/:id" element={<EditBusiness />} />
                  <Route path="/saved" element={<SavedBusinesses />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/user/:username" element={<UserProfile />} />
                </Routes>
              </main>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
            </Router>
          </UserProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App


