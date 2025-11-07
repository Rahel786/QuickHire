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

  // Function to load user from storage
  const loadUser = async () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify token with backend
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial load
    loadUser();

    // Listen for storage changes (when token/user is updated)
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom storage event (for same-window updates)
    window.addEventListener('localStorageUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, []);

  // Auth methods
  const signUp = async (email, password, name, college, batchYear, userType = 'student', yearsExperience = null, companyName = null) => {
    try {
      const response = await authAPI.register(email, password, name, college, batchYear, userType, yearsExperience, companyName);
      
      // Check for error first
      if (response && response.error) {
        return { data: null, error: response.error };
      }
      
      // Check for success response
      if (response && response.user && response.token) {
        // Token and user should already be stored in localStorage by authAPI.register
        // But let's ensure user state is updated
        setUser(response.user);
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('localStorageUpdated'));
        return { data: response, error: null };
      }
      
      // If we get here, something went wrong
      console.error('Unexpected response format:', response);
      return { data: null, error: response?.error || 'Registration failed. Please try again.' };
    } catch (error) {
      console.error('SignUp error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Sign up failed. Please try again.';
      return { data: null, error: errorMessage };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.error) {
        return { data: null, error: response.error };
      }
      if (response.user) {
        setUser(response.user);
        return { data: response, error: null };
      }
      return { data: null, error: response.error || 'Login failed' };
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

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};