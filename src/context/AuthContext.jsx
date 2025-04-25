import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Note: Correct import for jwt-decode v3+
import { API_URL } from '../config/url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("decoded user", decoded);
      
      
      const userId = decoded.userId;
      
      if (!userId) {
        throw new Error("User ID not found in token");
      }
  
      // Make sure the endpoint matches your backend route
      const response = await axios.get(`${API_URL}/api/auth/users/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      
      if (!response.data?.user) {
        throw new Error("Invalid user data structure in response");
      }

      if(response.data.user.role !== "admin"){
        return false;
      }
  
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError(err.response?.data?.message || err.message || "Failed to load user data");
      logout();
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [fetchUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      await fetchUser(token);
      
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Verify token validity periodically
  useEffect(() => {
    if (!token) return;

    const checkTokenValidity = () => {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (err) {
        logout();
      }
    };

    const interval = setInterval(checkTokenValidity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error,
      login, 
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};