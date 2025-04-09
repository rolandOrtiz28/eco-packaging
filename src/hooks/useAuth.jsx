import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [justLoggedIn, setJustLoggedIn] = useState(false); // New flag to track login
  const navigate = useNavigate();

  const fetchUser = async () => {
    console.log("AuthProvider: fetchUser called");
    try {
      const response = await api.get('/user');
      console.log("AuthProvider: fetchUser response:", response.data);
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
      console.log("AuthProvider: fetchUser set state - isAuthenticated:", true, "isAdmin:", userData.role === "admin");
    } catch (error) {
      console.log("AuthProvider: fetchUser failed:", error.message);
      // Only reset state if not already authenticated or just logged in
      if (!isAuthenticated && !justLoggedIn) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        console.log("AuthProvider: fetchUser set state - isAuthenticated:", false, "isAdmin:", false);
      } else {
        console.log("AuthProvider: fetchUser failed but preserving state - isAuthenticated:", isAuthenticated, "isAdmin:", isAdmin);
      }
    } finally {
      setLoading(false);
      console.log("AuthProvider: fetchUser loading set to false");
    }
  };

  useEffect(() => {
    if (justLoggedIn) {
      // Skip initial fetch if the user just logged in
      setLoading(false);
      return;
    }
    fetchUser();
  }, [justLoggedIn]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
      setJustLoggedIn(true); // Set flag to indicate a login occurred
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    console.log("AuthProvider: logout called");
    try {
      await api.post('/logout');
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setJustLoggedIn(false);
      console.log("AuthProvider: logout set state - isAuthenticated:", false, "isAdmin:", false);
      navigate("/login");
    } catch (error) {
      console.error('AuthProvider: Error during logout:', error);
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