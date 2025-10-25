import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from '../utils/axiosConfig'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        isAuthenticated: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  })

  // Set up axios interceptor for auth token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('userData')
      
      if (token && userData) {
        try {
          // Set the token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Parse the stored user data
          const parsedUserData = JSON.parse(userData)
          dispatch({ type: 'LOGIN_SUCCESS', payload: { ...parsedUserData, token } })
        } catch (error) {
          // Data is corrupted, clear it
          localStorage.removeItem('token')
          localStorage.removeItem('userData')
          delete axios.defaults.headers.common['Authorization']
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await axios.post('/api/users/login', { email, password })
      const { token, ...userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userData', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...userData, token } })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      return { success: false, error: message }
    }
  }

  const register = async (username, email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await axios.post('/api/users/register', { username, email, password })
      const { token, ...userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userData', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...userData, token } })
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      const message = error.response?.data?.message || error.message || 'Registration failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    delete axios.defaults.headers.common['Authorization']
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (userData) => {
    // Update localStorage with new user data
    localStorage.setItem('userData', JSON.stringify(userData))
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


