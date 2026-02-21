import axios from 'axios'

// Proxied through Vite dev server to avoid CORS.
// In production, replace with a server-side proxy or direct fetch with appropriate headers.
const mlbClient = axios.create({
  baseURL: '/mlb-api/api/v1',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

mlbClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg = error.response?.data?.message || error.message || 'MLB API error'
    return Promise.reject(new Error(msg))
  }
)

export default mlbClient
