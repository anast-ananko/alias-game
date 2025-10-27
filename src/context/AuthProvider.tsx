import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '../api';
import type { SignInFormData, SignUpFormData } from '../forms/auth';
import type { User } from '../types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.getProfile();
      setUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setUser(null);
        setError(err.message || 'Failed to fetch user');
      } else {
        setError('An unknow error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupDto: SignUpFormData) => {
    setIsLoading(true);
    try {
      const data = await authApi.signUp(signupDto);
      setUser(data.user);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setUser(null);
        setError(err.message || 'Login failed');
      } else {
        setError('An unknow error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginDto: SignInFormData) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(loginDto);
      setUser(data.user);
      setError(null);
      localStorage.setItem('accessToken', data.accessToken);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setUser(null);
        setError(err.message || 'Login failed');
      } else {
        setError('An unknow error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setUser(null);
        setError(err.message || 'Logout failed');
      } else {
        setError('An unknow error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signup,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
