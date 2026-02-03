// API Configuration
// In development: uses localhost:3000
// In production: uses VITE_API_URL environment variable or same origin

const API_URL = import.meta.env.MODE === "development"
  ? `http://${window.location.hostname}:3000`
  : import.meta.env.VITE_API_URL || '';

export default API_URL;
