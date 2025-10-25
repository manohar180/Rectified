import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, Users as UsersIcon, MapPin, Heart, Star, Plus, Minus, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const Users = () => {
  const { users, loading, fetchUsers, followUser } = useUser()
  const { user: currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [users, searchQuery])

  const handleFollow = async (userId, username) => {
    const result = await followUser(userId)
    if (result.success) {
      const action = result.isFollowing ? 'following' : 'unfollowing'
      toast.success(`You are now ${action} ${username}`)
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

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Discover <span className="text-gradient">Amazing People</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Connect with other users, follow your favorites, and discover new businesses through the community.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users by name or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-2 text-primary-500" />
              <span>{filteredUsers.length} Users</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              <span>Active Community</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              <span>Rated & Reviewed</span>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <UsersIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? 'No users found' : 'No users available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms or browse all users.' 
                : 'There are no users to display at the moment.'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.map((user, index) => (
              <div 
                key={user._id} 
                className="card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/user/${user.username}`}
                      className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {user.username}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.followers?.length || 0} followers
                    </p>
                  </div>
                </div>

                {user.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {user.bio}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{user.following?.length || 0} following</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{user.savedBusinesses?.length || 0} saved</span>
                    </div>
                  </div>

                  {currentUser && currentUser._id !== user._id && (
                    <button
                      onClick={() => handleFollow(user._id, user.username)}
                      className={`text-sm py-2 px-4 transition-all duration-200 ${
                        user.isFollowing 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' 
                          : 'btn-primary'
                      }`}
                    >
                      {user.isFollowing ? (
                        <Minus className="h-4 w-4 mr-1" />
                      ) : (
                        <Plus className="h-4 w-4 mr-1" />
                      )}
                      {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Users