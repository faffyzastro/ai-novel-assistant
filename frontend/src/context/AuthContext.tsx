import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoginResponse {
  user?: {
    id: number;
    username: string;
    email: string;
  };
  token?: string;
  message?: string;
}

interface AuthContextType {
  user: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: LoginResponse = await response.json();
      console.log('Backend response:', data); // Debug line
      if (!response.ok) {
        setError(data.message || 'Login failed');
        setUser(null);
      } else {
        setUser(data.user?.username || null);
        // Store token if needed
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err); // Debug line
      setError('Network error');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};