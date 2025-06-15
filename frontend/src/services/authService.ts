import api from './api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/users/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem('authToken');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
} 