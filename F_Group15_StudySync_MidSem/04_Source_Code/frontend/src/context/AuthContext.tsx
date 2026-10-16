/**
 * AuthContext — Global Authentication State
 * Member 1 (Frontend & UI/UX) — Sprint 1
 *
 * Provides: user state, token management, login, register, logout.
 * Persists JWT in localStorage under key 'ss_token'.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type { User, UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken]     = useState<string | null>(localStorage.getItem('ss_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Re-hydrate session on mount
  useEffect(() => {
    if (token) {
      authService.getMe()
        .then((res) => {
          setUser(res.data.user);
          setProfile(res.data.profile);
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function storeAuth(newUser: User, newToken: string, newProfile?: UserProfile) {
    localStorage.setItem('ss_token', newToken);
    setToken(newToken);
    setUser(newUser);
    if (newProfile) setProfile(newProfile);
  }

  async function register(fullName: string, email: string, password: string) {
    const res = await authService.register({ fullName, email, password });
    storeAuth(res.data.user, res.data.token);
  }

  async function login(email: string, password: string) {
    const res = await authService.login({ email, password });
    storeAuth(res.data.user, res.data.token);
  }

  function logout() {
    localStorage.removeItem('ss_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, token, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
