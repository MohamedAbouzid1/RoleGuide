'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, setAuthToken, getAuthToken } from './api-client';

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getAuthToken();
    if (token) {
      // Verify token with backend
      authApi.getSession()
        .then((response) => {
          setUser(response.user);
        })
        .catch(() => {
          // Token is invalid, remove it
          setAuthToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setAuthToken(response.token);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await authApi.register({ email, password, name });
    setAuthToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
