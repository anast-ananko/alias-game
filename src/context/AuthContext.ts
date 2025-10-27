import { createContext } from 'react';
import type { User } from '../types';
import type { SignInFormData, SignUpFormData } from '../forms/auth';

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signup: (dto: SignUpFormData) => Promise<void>;
  login: (dto: SignInFormData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
