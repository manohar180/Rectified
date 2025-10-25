import axios from 'axios'

export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...')
    const response = await axios.get('/api/users/test')
    console.log('Backend is running:', response.data)
    return true
  } catch (error) {
    console.error('Backend connection failed:', error.message)
    console.log('Make sure your backend server is running on port 5001')
    return false
  }
}

export const testRegistration = async (userData) => {
  try {
    console.log('Testing registration with:', userData)
    const response = await axios.post('/api/users/register', userData)
    console.log('Registration successful:', response.data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message)
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    }
  }
}
