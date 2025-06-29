// api.ts - Example API utility for fetching data

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  // You can add more config here (e.g., withCredentials, timeout)
});

export default api;

// Login endpoint (replace with your real backend URL)
export async function loginApi(username: string, password: string) {
  const response = await fetch('/api/auth/login', {
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