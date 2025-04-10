// useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
   
    try {
      const response = await api.get('/user');
     
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
    
    } catch (error) {
     
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Always fetch user on mount

  const login = async (credentials) => {
    try {
      setLoading(true); // Set loading to true during login
      const response = await api.post('/login', credentials);
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    console.log("AuthProvider: logout called");
    try {
      setLoading(true); // Set loading to true during logout
      await api.post('/logout');
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/login");
    } catch (error) {
      console.error('AuthProvider: Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}