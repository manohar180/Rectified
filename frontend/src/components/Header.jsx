import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Plus, Heart, User, LogOut, Bell, Users, MapPin, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">BusinessHub</h1>
            </div>
          </Link>


          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all duration-200 font-medium hover:-translate-y-0.5 hover:scale-105 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/create-business"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 font-medium hover:-translate-y-0.5 hover:scale-105 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Business</span>
                </Link>
                
                <Link
                  to="/saved"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium hover:-translate-y-0.5 hover:scale-105 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                >
                  <Heart className="h-4 w-4" />
                  <span>Saved</span>
                </Link>

                <Link
                  to="/users"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium hover:-translate-y-0.5 hover:scale-105 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
                >
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{user?.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-slide-up">
                      <Link
                        to="/"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Saved Businesses</span>
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header


