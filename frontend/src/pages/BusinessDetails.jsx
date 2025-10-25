import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from '../utils/axiosConfig'
import toast from 'react-hot-toast'
import { 
  Heart, 
  MapPin, 
  Star, 
  MessageCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Save,
  User,
  Calendar
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const BusinessDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [business, setBusiness] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    fetchBusinessDetails()
    fetchComments()
  }, [id])

  const fetchBusinessDetails = async () => {
    try {
      const response = await axios.get(`/api/businesses/${id}`)
      setBusiness(response.data)
      setIsLiked(response.data.likes?.some(like => like.toString() === user?._id))
      setIsSaved(response.data.savedBy?.some(saved => saved.toString() === user?._id))
    } catch (error) {
      toast.error('Failed to fetch business details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/businesses/${id}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('Failed to fetch comments')
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like businesses')
      return
    }

    try {
      await axios.put(`/api/businesses/${id}/like`)
      setIsLiked(!isLiked)
      toast.success(isLiked ? 'Removed from likes' : 'Added to likes')
      fetchBusinessDetails() // Refresh to get updated like count
    } catch (error) {
      toast.error('Failed to update like status')
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save businesses')
      return
    }

    try {
      if (isSaved) {
        await axios.put(`/api/users/unsave/${id}`)
        toast.success('Removed from saved businesses')
      } else {
        await axios.put(`/api/users/save/${id}`)
        toast.success('Added to saved businesses')
      }
      setIsSaved(!isSaved)
      fetchBusinessDetails() // Refresh to get updated save count
    } catch (error) {
      toast.error('Failed to update save status')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to comment')
      return
    }

    if (!commentText.trim()) {
      toast.error('Please enter a comment')
      return
    }

    try {
      await axios.post(`/api/businesses/${id}/comments`, { text: commentText })
      setCommentText('')
      toast.success('Comment added')
      fetchComments()
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const handleRating = async (newRating) => {
    if (!isAuthenticated) {
      toast.error('Please login to rate businesses')
      return
    }

    try {
      await axios.post(`/api/businesses/${id}/ratings`, { value: newRating })
      setRating(newRating)
      toast.success('Rating submitted')
      fetchBusinessDetails() // Refresh to get updated rating
    } catch (error) {
      toast.error('Failed to submit rating')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this business?')) {
      return
    }

    try {
      await axios.delete(`/api/businesses/${id}`)
      toast.success('Business deleted')
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete business')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Business not found</h1>
          <p className="text-gray-600 mt-2">The business you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const isOwner = user?._id === business.owner?._id

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Business Header */}
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
            <p className="text-lg text-gray-600">{business.category}</p>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/edit-business/${id}`)}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Business Image */}
        {business.images && business.images.length > 0 && (
          <div className="mb-6">
            <img
              src={business.images[0]}
              alt={business.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Business Info */}
        <div className="space-y-4">
          <p className="text-gray-700">{business.description}</p>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{business.location}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            {business.averageRating > 0 && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{business.averageRating.toFixed(1)}</span>
                <span className="ml-1">({business.numRatings} ratings)</span>
              </div>
            )}
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{business.numComments} comments</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{business.numSaves} saves</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(business.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-center space-x-2 pt-4 border-t">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              by <span className="font-medium">{business.owner?.username}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {isAuthenticated && (
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isLiked 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
            
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isSaved 
                  ? 'bg-primary-500 text-white hover:bg-primary-600' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Rating Section */}
      {isAuthenticated && (
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Rate this business</h3>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
        
        {/* Add Comment */}
        {isAuthenticated && (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
            />
            <button
              type="submit"
              className="mt-2 btn-primary"
            >
              Add Comment
            </button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{comment.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default BusinessDetails


