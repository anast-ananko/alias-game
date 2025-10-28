import { createContext } from 'react';
import type { User } from '../types';
import type { SignInFormData, SignUpFormData } from '../forms/auth';

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setError: (message: string | null) => void;
  signup: (dto: SignUpFormData) => Promise<void>;
  login: (dto: SignInFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
