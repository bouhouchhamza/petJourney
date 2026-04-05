import axios from 'axios';

/**
 * Central Axios instance for all API calls.
 *
 * withCredentials: true  ← CRITICAL: tells the browser to send the HttpOnly
 * cookie with every request, even across different domains (Vercel deployments).
 * Without this, the JWT cookie is silently ignored and the user appears logged out.
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
