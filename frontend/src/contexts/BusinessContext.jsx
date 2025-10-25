import { createContext, useContext, useReducer } from 'react'
import axios from '../utils/axiosConfig'

const BusinessContext = createContext()

const businessReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_BUSINESSES':
      return { ...state, businesses: action.payload, loading: false }
    case 'ADD_BUSINESS':
      return { ...state, businesses: [action.payload, ...state.businesses] }
    case 'UPDATE_BUSINESS':
      return {
        ...state,
        businesses: state.businesses.map(business =>
          business._id === action.payload._id ? action.payload : business
        )
      }
    case 'DELETE_BUSINESS':
      return {
        ...state,
        businesses: state.businesses.filter(business => business._id !== action.payload)
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

export const BusinessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(businessReducer, {
    businesses: [],
    loading: false,
    error: null
  })

  const fetchBusinesses = async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })
      
      const response = await axios.get(`/api/businesses?${params.toString()}`)
      dispatch({ type: 'SET_BUSINESSES', payload: response.data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch businesses' })
    }
  }

  const createBusiness = async (businessData) => {
    try {
      const formData = new FormData()
      Object.keys(businessData).forEach(key => {
        if (businessData[key] !== null && businessData[key] !== undefined) {
          formData.append(key, businessData[key])
        }
      })

      const response = await axios.post('/api/businesses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      dispatch({ type: 'ADD_BUSINESS', payload: response.data })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create business' }
    }
  }

  const updateBusiness = async (id, businessData) => {
    try {
      const formData = new FormData()
      Object.keys(businessData).forEach(key => {
        if (businessData[key] !== null && businessData[key] !== undefined) {
          formData.append(key, businessData[key])
        }
      })

      const response = await axios.put(`/api/businesses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      dispatch({ type: 'UPDATE_BUSINESS', payload: response.data })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update business' }
    }
  }

  const deleteBusiness = async (id) => {
    try {
      await axios.delete(`/api/businesses/${id}`)
      dispatch({ type: 'DELETE_BUSINESS', payload: id })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete business' }
    }
  }

  const likeBusiness = async (id) => {
    try {
      await axios.put(`/api/businesses/${id}/like`)
      // Refresh businesses to get updated like count
      fetchBusinesses()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to like business' }
    }
  }

  const saveBusiness = async (id) => {
    try {
      await axios.put(`/api/users/save/${id}`)
      // Refresh businesses to get updated save count
      fetchBusinesses()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to save business' }
    }
  }

  const refreshBusinesses = () => {
    // This will trigger a re-fetch of businesses
    fetchBusinesses()
  }

  const value = {
    ...state,
    fetchBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    likeBusiness,
    saveBusiness,
    refreshBusinesses
  }

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  )
}

export const useBusiness = () => {
  const context = useContext(BusinessContext)
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}


