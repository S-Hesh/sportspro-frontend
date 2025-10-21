// src/hooks/useAuth.ts
import { useState } from "react";
import axiosClient from "@/api/axiosClient";

// named export
export interface User {
  userId: number;
  name: string;
  email: string;
  sport: string;
  avatar?: string;
  bio?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: this hits POST /api/auth/login
      const { data } = await axiosClient.post<AuthResponse>("/auth/login", { email, password });
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    sport: string,
    password: string
  ): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: this hits POST /api/auth/register
      const { data } = await axiosClient.post<AuthResponse>("/auth/register", {name, email, sport, password,      });
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
}
