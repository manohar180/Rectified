import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from '../utils/axiosConfig'
import toast from 'react-hot-toast'
import { User, Mail, MapPin, Calendar, Edit, Plus, Heart, MessageCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth()
  const navigate = useNavigate()
  const [userBusinesses, setUserBusinesses] = useState([])
  const [savedBusinesses, setSavedBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('my-businesses')
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || ''
  })

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      })
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const [businessesResponse, savedResponse] = await Promise.all([
        axios.get('/api/users/profile/posts'),
        axios.get('/api/users/profile/saved')
      ])
      
      setUserBusinesses(businessesResponse.data)
      setSavedBusinesses(savedResponse.data)
    } catch (error) {
      toast.error('Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put('/api/users/profile', profileData)
      updateUser(response.data)
      setEditMode(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleDeleteBusiness = async (businessId) => {
    if (!window.confirm('Are you sure you want to delete this business?')) {
      return
    }

    try {
      await axios.delete(`/api/businesses/${businessId}`)
      setUserBusinesses(prev => prev.filter(business => business._id !== businessId))
      toast.success('Business deleted successfully')
    } catch (error) {
      toast.error('Failed to delete business')
    }
  }

  const handleUnsaveBusiness = async (businessId) => {
    try {
      await axios.put(`/api/users/unsave/${businessId}`)
      setSavedBusinesses(prev => prev.filter(business => business._id !== businessId))
      toast.success('Business removed from saved')
    } catch (error) {
      toast.error('Failed to unsave business')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card p-6 mb-6 animate-fade-in-up hover:animate-glow">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {user?.username}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{user?.email}</span>
              </div>
              {user?.bio && (
                <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user?.following?.length || 0} following</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{user?.savedBusinesses?.length || 0} saved</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined on {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        {editMode && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={profileData.profilePicture}
                  onChange={(e) => setProfileData(prev => ({ ...prev, profilePicture: e.target.value }))}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdateProfile}
                  className="btn-primary"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditMode(false)
                    setProfileData({
                      bio: user?.bio || '',
                      profilePicture: user?.profilePicture || ''
                    })
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 animate-slide-up">
        <button
          onClick={() => setActiveTab('my-businesses')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'my-businesses'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 shadow-md'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          My Businesses ({userBusinesses.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'saved'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 shadow-md'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Saved ({savedBusinesses.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'my-businesses' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Businesses</h2>
            <button
              onClick={() => navigate('/create-business')}
              className="flex items-center space-x-2 btn-primary"
            >
              <Plus className="h-4 w-4" />
              <span>Add Business</span>
            </button>
          </div>

          {userBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first business</p>
              <button
                onClick={() => navigate('/create-business')}
                className="btn-primary"
              >
                Add Business
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBusinesses.map((business, index) => (
                <div 
                  key={business._id} 
                  className="card p-6 animate-fade-in hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {business.images && business.images.length > 0 && (
                    <img
                      src={business.images[0]}
                      alt={business.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{business.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{business.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{business.numComments}</span>
                      </div>
                    </div>
                    <span>{new Date(business.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/business/${business._id}`)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-business/${business._id}`)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBusiness(business._id)}
                      className="px-3 py-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Businesses</h2>
          
          {savedBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Heart className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved businesses</h3>
              <p className="text-gray-600">Start exploring and save businesses you like</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBusinesses.map((business, index) => (
                <div 
                  key={business._id} 
                  className="card p-6 animate-fade-in hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {business.images && business.images.length > 0 && (
                    <img
                      src={business.images[0]}
                      alt={business.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{business.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{business.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{business.numComments}</span>
                      </div>
                    </div>
                    <span>{new Date(business.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/business/${business._id}`)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleUnsaveBusiness(business._id)}
                      className="flex-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      Unsave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile


