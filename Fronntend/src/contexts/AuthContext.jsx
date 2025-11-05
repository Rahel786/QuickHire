import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify token with backend
        authAPI.getCurrentUser()
          .then((response) => {
            setUser(response.user);
          })
          .catch(() => {
            // Token invalid, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Auth methods
  const signUp = async (email, password, name) => {
    try {
      const response = await authAPI.register(email, password, name);
      if (response.user) {
        setUser(response.user);
        return { data: response, error: null };
      }
      return { data: null, error: 'Registration failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Sign up failed';
      return { data: null, error: errorMessage };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.user) {
        setUser(response.user);
        return { data: response, error: null };
      }
      return { data: null, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Sign in failed';
      return { data: null, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      authAPI.logout();
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error: error?.message || 'Sign out failed' };
    }
  };

  const signInWithOAuth = async (provider) => {
    try {
      // Mock OAuth login - can be extended with actual OAuth
      const mockUser = {
        id: `user_${Date.now()}`,
        email: `user@${provider}.com`,
        name: provider,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { data: { user: mockUser }, error: null };
    } catch (error) {
      return { data: null, error: error?.message || 'OAuth sign in failed' };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};