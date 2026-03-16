const API_BASE = import.meta.env.PROD
  ? 'https://lotef-api.onrender.com/api'
  : 'http://localhost:3002/api'

export default API_BASE
