import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import toast from 'react-hot-toast'
import { Heart, MessageCircle, Eye, MapPin } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const SavedBusinesses = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [savedBusinesses, setSavedBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  useEffect(() => {
    fetchSavedBusinesses()
  }, [])

  const fetchSavedBusinesses = async () => {
    try {
      const response = await axios.get('/api/users/profile/saved')
      setSavedBusinesses(response.data)
    } catch (error) {
      toast.error('Failed to fetch saved businesses')
    } finally {
      setLoading(false)
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Businesses</h1>
        <p className="text-gray-600">Your collection of saved businesses</p>
      </div>

      {savedBusinesses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved businesses</h3>
          <p className="text-gray-600 mb-4">Start exploring and save businesses you like</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Explore Businesses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedBusinesses.map(business => (
            <div key={business._id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              {/* Business Image */}
              <div className="relative mb-4">
                {business.images && business.images.length > 0 ? (
                  <img
                    src={business.images[0]}
                    alt={business.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Business Info */}
              <div className="space-y-3">
                <div>
                  <h3 
                    onClick={() => navigate(`/business/${business._id}`)}
                    className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    {business.name}
                  </h3>
                  <p className="text-sm text-gray-600">{business.category}</p>
                </div>

                <p className="text-gray-700 line-clamp-2">{business.description}</p>

                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{business.location}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{business.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{business.numComments}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{business.numSaves}</span>
                    </div>
                  </div>
                  <span className="text-xs">{new Date(business.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Owner */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    by <span className="font-medium">{business.owner?.username}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => navigate(`/business/${business._id}`)}
                  className="flex-1 btn-secondary text-sm"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleUnsaveBusiness(business._id)}
                  className="flex-1 text-red-600 hover:text-red-700 text-sm border border-red-300 hover:border-red-400 rounded-lg py-2 px-3 transition-colors"
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedBusinesses


