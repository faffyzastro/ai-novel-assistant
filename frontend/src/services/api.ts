// api.ts - Example API utility for fetching data

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (optional, but good practice)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If token is expired or invalid, redirect to login
    if (error.response && error.response.status === 401) {
      // You might want to clear local storage and redirect to login page
      console.error('Unauthorized access - redirecting to login');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;

// Login endpoint (replace with your real backend URL)
export async function loginApi(username: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

// Fetch current user endpoint
export async function fetchUser() {
  const response = await fetch('/api/user');
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

// Fetch stories endpoint
export async function fetchStories() {
  const response = await fetch('/api/stories');
  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }
  return response.json();
}

// Add more API functions as needed 