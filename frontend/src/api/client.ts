import axios from 'axios'

// Axios client with baseURL from environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

// Function to set authorization token in headers
export const setAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

export default apiClient
