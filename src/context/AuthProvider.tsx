import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '../api';
import type { SignInFormData, SignUpFormData } from '../forms/auth';
import type { User } from '../types';
import Loader from '../components/Loader';
import axios from 'axios';

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
      const { user, accessToken } = await authApi.signUp(signupDto);
      setUser(user);
      setError(null);
      localStorage.setItem('accessToken', accessToken);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || 'Registration failed');
      } else if (err instanceof Error) {
        setError(err.message || 'Registration failed');
      } else {
        setError('An unknown error occurred');
      }

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginDto: SignInFormData) => {
    setIsLoading(true);
    try {
      const { user, accessToken } = await authApi.login(loginDto);
      setUser(user);
      setError(null);
      localStorage.setItem('accessToken', accessToken);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || 'Login failed');
      } else if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('An unknown error occurred');
      }

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      localStorage.removeItem('accessToken');
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

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;

  // useEffect(() => {
  //   fetchCurrentUser();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        setError,
        signup,
        login,
        logout,
        updateUser,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
