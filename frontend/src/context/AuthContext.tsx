import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout, getAuthToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // You might need to install jwt-decode: npm install jwt-decode

// Define a User interface for clarity
interface User {
  id: string;
  username: string;
  email: string;
}

// AuthContext provides authentication state, loading, error, and login/logout functions.
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider wraps the app and provides auth state.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on initial load
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decodedUser: User = jwtDecode(token);
        setUser(decodedUser);
      } catch (err) {
        console.error("Failed to decode token:", err);
        authLogout(); // Clear invalid token
        setUser(null);
      }
    }
  }, []);

  // Async login with loading and error state
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authLogin(email, password);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Async register with loading and error state
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRegister(username, email, password);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Async logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      authLogout();
      setUser(null);
    } catch (err: any) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 