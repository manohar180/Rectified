import { createContext, useContext, useReducer } from 'react'
import axios from '../utils/axiosConfig'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false }
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload, loading: false }
    case 'UPDATE_FOLLOW_STATUS':
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload.userId
            ? { ...user, isFollowing: action.payload.isFollowing }
            : user
        ),
        userProfile: state.userProfile && state.userProfile.user._id === action.payload.userId
          ? {
              ...state.userProfile,
              user: {
                ...state.userProfile.user,
                followers: action.payload.isFollowing
                  ? [...state.userProfile.user.followers, action.payload.currentUserId]
                  : state.userProfile.user.followers.filter(id => id !== action.payload.currentUserId)
              }
            }
          : state.userProfile
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    users: [],
    userProfile: null,
    loading: false,
    error: null
  })

  const fetchUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.get('/api/users')
      // Add isFollowing property to each user (default to false)
      const usersWithFollowStatus = response.data.map(user => ({
        ...user,
        isFollowing: user.isFollowing || false
      }))
      dispatch({ type: 'SET_USERS', payload: usersWithFollowStatus })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch users' })
    }
  }

  const getUserProfile = async (username) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.get(`/api/users/${username}`)
      dispatch({ type: 'SET_USER_PROFILE', payload: response.data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch user profile' })
    }
  }

  const followUser = async (userId) => {
    try {
      const response = await axios.put(`/api/users/${userId}/follow`)
      dispatch({ 
        type: 'UPDATE_FOLLOW_STATUS', 
        payload: { 
          userId, 
          isFollowing: response.data.isFollowing,
          currentUserId: response.data.currentUserId 
        } 
      })
      return { success: true, isFollowing: response.data.isFollowing }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to follow user' }
    }
  }

  const value = {
    ...state,
    fetchUsers,
    getUserProfile,
    followUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
