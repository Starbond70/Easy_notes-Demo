import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const token = localStorage.getItem('token');
    if (token) {
      apiService.getProfile()
        .then(response => {
          setCurrentUser(response.user);
        })
        .catch(error => {
          console.error('Failed to get profile:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const response = await apiService.register({ email, password, displayName });
      
      // Store token and set user
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login({ email, password });
      
      // Store token and set user
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove token and clear user
      localStorage.removeItem('token');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if there's an error
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
