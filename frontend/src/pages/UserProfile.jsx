import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import LoadingSpinner from '../components/LoadingSpinner'
import BusinessCard from '../components/BusinessCard'
import { User, Users, MapPin, Heart, Star, Plus, Minus, Calendar, Building } from 'lucide-react'
import toast from 'react-hot-toast'

const UserProfile = () => {
  const { username } = useParams()
  const { userProfile, loading, getUserProfile, followUser } = useUser()
  const { user: currentUser } = useAuth()
  const { businesses } = useBusiness()
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (username) {
      getUserProfile(username)
    }
  }, [username])

  // ✅ FIXED useEffect to prevent crash on Follow click
  useEffect(() => {
    if (userProfile && currentUser) {
      const following = userProfile.user.followers?.some(follower => {
        const followerId = typeof follower === 'object' ? follower._id : follower
        return followerId === currentUser._id
      })
      setIsFollowing(!!following)
    }
  }, [userProfile, currentUser])

  const handleFollow = async () => {
    if (!userProfile) return
    
    const result = await followUser(userProfile.user._id)
    if (result.success) {
      setIsFollowing(!isFollowing)
      toast.success(isFollowing ? `Unfollowed ${userProfile.user.username}` : `Now following ${userProfile.user.username}`)
    } else {
      toast.error(result.error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">User not found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/users" className="btn-primary">
            Browse Users
          </Link>
        </div>
      </div>
    )
  }

  const { user, businesses: userBusinesses } = userProfile
  const isOwnProfile = currentUser && currentUser._id === user._id

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {user.username}
                  </h1>
                  {user.bio && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Follow Button */}
                {!isOwnProfile && currentUser && (
                  <button
                    onClick={handleFollow}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isFollowing
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                        : 'btn-primary'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Minus className="h-4 w-4" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{user.followers?.length || 0}</span>
                  <span>followers</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">{user.following?.length || 0}</span>
                  <span>following</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Building className="h-5 w-5" />
                  <span className="font-medium">{userBusinesses?.length || 0}</span>
                  <span>businesses</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Businesses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isOwnProfile ? 'My Businesses' : `${user.username}'s Businesses`}
            </h2>
            {isOwnProfile && (
              <Link to="/create-business" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Link>
            )}
          </div>

          {userBusinesses && userBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userBusinesses.map((business, index) => (
                <div 
                  key={business._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BusinessCard business={business} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-6">
                <Building className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {isOwnProfile ? 'No businesses yet' : 'No businesses posted'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                {isOwnProfile 
                  ? 'Start by adding your first business to the platform.'
                  : `${user.username} hasn't posted any businesses yet.`}
              </p>
              {isOwnProfile && (
                <Link to="/create-business" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Business
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Followers/Following Section */}
        {(user.followers?.length > 0 || user.following?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Followers */}
            {user.followers?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Followers ({user.followers.length})
                </h3>
                <div className="space-y-3">
{user.followers?.slice(0, 5).map((follower, idx) => {
  if (!follower) return null
  const f = typeof follower === 'object' ? follower : {}
  return (
    <div key={f._id || idx} className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
        {f.profilePicture ? (
          <img
            src={f.profilePicture}
            alt={f.username || 'Follower'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <User className="h-4 w-4 text-white" />
        )}
      </div>
      <Link
        to={`/user/${f.username || ''}`}
        className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        {f.username || 'Unknown'}
      </Link>
    </div>
  )
})}

                  {user.followers.length > 5 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      +{user.followers.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Following */}
            {user.following?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Following ({user.following.length})
                </h3>
                <div className="space-y-3">
                  {user.following?.slice(0, 5).map((following, idx) => {
  if (!following) return null
  const f = typeof following === 'object' ? following : {}
  return (
    <div key={f._id || idx} className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
        {f.profilePicture ? (
          <img
            src={f.profilePicture}
            alt={f.username || 'Following'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <User className="h-4 w-4 text-white" />
        )}
      </div>
      <Link
        to={`/user/${f.username || ''}`}
        className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        {f.username || 'Unknown'}
      </Link>
    </div>
  )
})}

                  {user.following.length > 5 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      +{user.following.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
