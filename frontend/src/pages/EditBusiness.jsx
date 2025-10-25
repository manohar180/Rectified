import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const EditBusiness = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { updateBusiness } = useBusiness()
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  useEffect(() => {
    fetchBusiness()
  }, [id])

  const fetchBusiness = async () => {
    try {
      const response = await axios.get(`/api/businesses/${id}`)
      const businessData = response.data
      
      // Check if user is the owner
      if (businessData.owner._id !== user._id) {
        toast.error('You are not authorized to edit this business')
        navigate('/')
        return
      }

      setBusiness(businessData)
      setValue('name', businessData.name)
      setValue('description', businessData.description)
      setValue('category', businessData.category)
      setValue('location', businessData.location)
      
      if (businessData.images && businessData.images.length > 0) {
        setImagePreview(businessData.images[0])
      }
    } catch (error) {
      toast.error('Failed to fetch business details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const formData = {
      name: data.name,
      description: data.description,
      category: data.category,
      location: data.location,
      image: selectedImage
    }

    const result = await updateBusiness(id, formData)
    if (result.success) {
      toast.success('Business updated successfully!')
      navigate(`/business/${id}`)
    } else {
      toast.error(result.error)
    }
    setIsSubmitting(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const categories = [
    'Restaurant', 'Retail', 'Service', 'Technology', 'Healthcare',
    'Education', 'Entertainment', 'Automotive', 'Real Estate', 'Other'
  ]

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Business not found</h1>
          <p className="text-gray-600 mt-2">The business you're trying to edit doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Business</h1>
        <p className="text-gray-600">Update your business information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name *
          </label>
          <input
            {...register('name', { 
              required: 'Business name is required',
              minLength: {
                value: 2,
                message: 'Business name must be at least 2 characters'
              }
            })}
            type="text"
            className="input-field"
            placeholder="Enter business name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="input-field"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            {...register('location', { 
              required: 'Location is required',
              minLength: {
                value: 2,
                message: 'Location must be at least 2 characters'
              }
            })}
            type="text"
            className="input-field"
            placeholder="Enter business location"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            {...register('description', { 
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters'
              }
            })}
            rows="4"
            className="input-field"
            placeholder="Describe your business..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Image
          </label>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload a new business image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-secondary cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/business/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating Business...' : 'Update Business'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditBusiness


