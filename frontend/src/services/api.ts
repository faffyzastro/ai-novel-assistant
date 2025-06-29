// api.ts - Example API utility for fetching data

import axios from 'axios';
import { BACKEND_URL } from "../config";

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
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
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
  const token = localStorage.getItem('token');
  const response = await fetch(`${BACKEND_URL}/api/users/me`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

// Fetch stories endpoint
export async function fetchStories() {
  const response = await fetch(`${BACKEND_URL}/api/stories`);
  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }
  return response.json();
}

// Update user profile
export async function updateUserProfile(data: { name?: string; email?: string; avatar?: string; bio?: string }) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BACKEND_URL}/api/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update user profile');
  }
  return response.json();
}

// Fetch user by id
export async function fetchUserById(id: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BACKEND_URL}/api/users/${id}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

// Add more API functions as needed 