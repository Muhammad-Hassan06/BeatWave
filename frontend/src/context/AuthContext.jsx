import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://beatwave-yh9u.onrender.com";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = () => {
    const token = getCookie("token");
    if (!token) {
      setUser(null);
      localStorage.removeItem("spotify_username");
      localStorage.removeItem("spotify_role");
    } else {
      const decoded = decodeToken(token);
      if (decoded) {
        const savedUsername = localStorage.getItem("spotify_username") || "Account";
        setUser({
          id: decoded.id,
          role: decoded.role,
          username: savedUsername,
        });
      } else {
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: usernameOrEmail,
          email: usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("spotify_username", usernameOrEmail);
      
      setTimeout(() => {
        checkAuth();
      }, 100);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const register = async (username, email, password, role) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("spotify_username", username);
      
      setTimeout(() => {
        checkAuth();
      }, 100);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, { 
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout request error", err);
    }
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("spotify_username");
    localStorage.removeItem("spotify_role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
