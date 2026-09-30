import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on application startup
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data.success && data.user) {
            setUser(data.user);
            setToken(storedToken);
          } else {
            // Invalid response
            localStorage.removeItem('taskflow_token');
            localStorage.removeItem('taskflow_user');
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error('Session validation error:', error.message);
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.token && data.user) {
        localStorage.setItem('taskflow_token', data.token);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Unable to log in';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      if (data.token && data.user) {
        localStorage.setItem('taskflow_token', data.token);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  }, []);

  // Update profile
  const updateUserProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      }
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('taskflow_token', data.token);
      }
      return { success: true, message: data.message || 'Profile updated' };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update profile';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
