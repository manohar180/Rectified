import { Link } from 'react-router-dom'
import { Heart, MapPin, Star, MessageCircle, Eye, User, Calendar, Save, Plus, Minus, Edit } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import { useUser } from '../contexts/UserContext'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from '../utils/axiosConfig'

const BusinessCard = ({ business }) => {
  const { isAuthenticated, user } = useAuth()
  const { likeBusiness, refreshBusinesses } = useBusiness()
  const { followUser } = useUser()
  const [isLiked, setIsLiked] = useState(business.likes?.some(like => like.toString() === user?._id))
  const [isSaved, setIsSaved] = useState(business.savedBy?.some(saved => saved.toString() === user?._id))
  
  // Update state when business data changes
  useEffect(() => {
    const liked = business.likes?.some(like => like.toString() === user?._id) || false
    const saved = business.savedBy?.some(saved => saved.toString() === user?._id) || false
    
    setIsLiked(liked)
    setIsSaved(saved)
  }, [business.likes, business.savedBy, user?._id, business._id])
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingBusiness, setIsSavingBusiness] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like businesses')
      return
    }

    // Optimistic update
    const previousLiked = isLiked
    setIsLiked(!isLiked)
    
    setIsSaving(true)
    const result = await likeBusiness(business._id)
    if (!result.success) {
      // Revert on failure
      setIsLiked(previousLiked)
      toast.error(result.error)
    }
    setIsSaving(false)
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save businesses')
      return
    }

    // Optimistic update - same as like button
    const previousSaved = isSaved
    setIsSaved(!isSaved)
    
    setIsSavingBusiness(true)
    
    try {
      if (previousSaved) {
        await axios.put(`/api/users/unsave/${business._id}`)
        toast.success('Removed from saved businesses')
      } else {
        await axios.put(`/api/users/save/${business._id}`)
        toast.success('Added to saved businesses')
      }
    } catch (error) {
      // Revert on failure - same as like button
      setIsSaved(previousSaved)
      if (previousSaved) {
        toast.error('Business not saved')
      } else {
        toast.error('Business already saved')
      }
    } finally {
      setIsSavingBusiness(false)
    }
  }

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users')
      return
    }

    if (!business.owner?._id) return

    const result = await followUser(business.owner._id)
    if (result.success) {
      setIsFollowing(!isFollowing)
      toast.success(isFollowing ? `Unfollowed ${business.owner.username}` : `Now following ${business.owner.username}`)
    } else {
      toast.error(result.error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="card card-hover p-0 overflow-hidden animate-fade-in group">
      {/* Business Image */}
      <div className="relative h-48 overflow-hidden">
        {business.images && business.images.length > 0 ? (
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="h-8 w-8 text-gray-500" />
              </div>
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleLike}
            disabled={isSaving}
            className={`p-2 rounded-full transition-all duration-200 shadow-lg hover:scale-110 ${
              isLiked 
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse-slow' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSavingBusiness}
            className={`p-2 rounded-full transition-all duration-200 shadow-lg hover:scale-110 ${
              isSaved 
                ? 'bg-primary-500 text-white hover:bg-primary-600 animate-pulse-slow' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 dark:hover:text-primary-400'
            } ${isSavingBusiness ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
            {business.category}
          </span>
        </div>
      </div>

      {/* Business Info */}
      <div className="p-6 space-y-4">
        <div>
          <Link 
            to={`/business/${business._id}`}
            className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
          >
            {business.name}
          </Link>
          <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{business.description}</p>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2 text-primary-500" />
          <span className="line-clamp-1">{business.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            {business.averageRating > 0 && (
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-1" />
                <span className="font-medium text-yellow-700 dark:text-yellow-300">{business.averageRating.toFixed(1)}</span>
                <span className="text-yellow-600 dark:text-yellow-400 ml-1">({business.numRatings})</span>
              </div>
            )}
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{business.numComments}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Eye className="h-4 w-4 mr-1" />
              <span>{business.numSaves}</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(business.createdAt)}</span>
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-400 to-blue-400 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              by <Link 
                to={`/user/${business.owner?.username}`}
                className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {business.owner?.username}
              </Link>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated && business.owner?._id === user?._id && (
              <Link
                to={`/edit-business/${business._id}`}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium bg-green-500 hover:bg-green-600 text-white transition-all duration-200"
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </Link>
            )}
            
            {isAuthenticated && business.owner?._id !== user?._id && (
              <button
                onClick={handleFollow}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isFollowing
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Minus className="h-3 w-3" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
            
            <Link
              to={`/business/${business._id}`}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessCard


