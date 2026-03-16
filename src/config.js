const API_BASE = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:3002/api'

export default API_BASE
