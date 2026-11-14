import React from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshUser(); }, []);

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    setUser(data.user);
    return data;
  }

  async function register(details) {
    const { data } = await api.post("/auth/register", details);
    setUser(data.user);
    return data;
  }

  async function logout() {
    try { await api.post("/auth/logout"); }
    finally { setUser(null); }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
