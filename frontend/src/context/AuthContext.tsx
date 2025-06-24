// frontend/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed: npm install axios
import { useNavigate } from 'react-router-dom'; // If you want to redirect after login/logout

// Define the shape of your user data (adjust as per your backend response)
interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties like 'role' if applicable
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>; // Added 'name' and 'email'
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate for potential redirects

  // Set your backend API base URL
  // Ensure this matches where your backend Express app is listening and where your routes are mounted.
  // If your user routes are at http://localhost:8000/api/users, then BASE_API_URL should be http://localhost:8000/api
  const BASE_API_URL = 'http://localhost:8000'; // Assuming your backend runs on port 8000

  // --- Registration Function ---
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Make a POST request to your backend's user creation endpoint
      // This maps to your backend's router.post('/', createUser);
      const response = await axios.post(`${BASE_API_URL}/api/users`, {
        name,
        email,
        password,
      });

      console.log('Registration successful:', response.data);
      setLoading(false);
      return true; // Indicate success
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);
      // Set error message from backend or a generic one
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
      return false; // Indicate failure
    }
  };

  // --- Login Function ---
  // This function will be called by your Login component
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Make a POST request to your backend's login endpoint
      // You NEED to implement this endpoint in your backend (e.g., POST /api/login)
      const response = await axios.post(`${BASE_API_URL}/api/login`, {
        email,
        password,
      });

      const { user: userData, token: userToken } = response.data; // Assuming your backend sends 'user' and 'token'

      setUser(userData);
      setToken(userToken);

      // Store user data and token in localStorage for persistence across page refreshes
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);

      setLoading(false);
      navigate('/dashboard'); // Redirect to dashboard on successful login
      return true; // Indicate success
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
      // Set error message from backend or a generic one
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      setLoading(false);
      return false; // Indicate failure
    }
  };

  // --- Logout Function ---
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page on logout
  };

  // --- Load user/token from localStorage on initial render ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        logout(); // Clear invalid data
      }
    }
  }, []);

  // Provide the context values to children components
  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};