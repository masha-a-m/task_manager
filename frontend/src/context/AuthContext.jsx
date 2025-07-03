import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || null);
  const navigate = useNavigate();

  // Set default axios headers if token exists
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      // Optionally fetch user data here
      fetchUserData();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  // Fetch user data (example)
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);
      setRefreshToken(refresh);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error; // Let the login component handle the error
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
      });
      // Auto-login after registration
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    navigate('/login');
  };

  // Add token refresh logic
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      setAccessToken(access);
      return access;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};