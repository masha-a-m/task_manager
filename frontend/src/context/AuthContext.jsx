import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  // Optional: Fetch user data based on token
  useEffect(() => {
    if (token) {
      // You can fetch real user data later
      setUser({ username: 'TestUser' });
    }
  }, [token]);

  const login = (authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser({ username: 'TestUser' });
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};