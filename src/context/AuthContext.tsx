import React, { createContext, useContext, useState } from 'react';

// AuthContext provides authentication state, loading, error, and login/logout functions.
interface AuthContextType {
  user: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulate async login/logout (replace with real API calls in production)
const fakeAuthApi = {
  login: (username: string, password: string) =>
    new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (username === 'user' && password === 'password') resolve(username);
        else reject(new Error('Invalid credentials'));
      }, 1000);
    }),
  logout: () => new Promise<void>((resolve) => setTimeout(resolve, 500)),
};

// AuthProvider wraps the app and provides auth state.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Async login with loading and error state
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await fakeAuthApi.login(username, password);
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message);
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
      await fakeAuthApi.logout();
      setUser(null);
    } catch (err: any) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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