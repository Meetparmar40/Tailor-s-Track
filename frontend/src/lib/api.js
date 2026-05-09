import axios from "axios";

// API Configuration
// In development: uses localhost:3000
// In production: uses VITE_API_URL environment variable or same origin

const API_URL = import.meta.env.MODE === "development"
  ? `http://${window.location.hostname}:3000`
  : import.meta.env.VITE_API_URL || '';

let authTokenProvider = null;

export const setAuthTokenProvider = (provider) => {
  authTokenProvider = provider;
};

axios.interceptors.request.use(async (config) => {
  const url = config.url || "";
  const isApiRequest = API_URL
    ? url.startsWith(API_URL) || url.startsWith("/api")
    : url.startsWith("/api");

  if (!isApiRequest) {
    return config;
  }

  const token = await authTokenProvider?.();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authFetch = async (input, init = {}) => {
  const token = await authTokenProvider?.();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers });
};

export default API_URL;
