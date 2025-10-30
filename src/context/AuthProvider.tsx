import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '../api';
import type { SignInFormData, SignUpFormData } from '../forms/auth';
import type { User } from '../types';
import Loader from '../components/Loader';
import axios from 'axios';
import { socket } from '../socket';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await authApi.getProfile();
      console.log(data);
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
    const roomId = localStorage.getItem('currentRoomId');
    if (socket.connected && roomId && user?._id) {
      socket.emit('room:leave', { roomId, userId: user._id });
    }
    socket.disconnect();

    setIsLoading(true);
    try {
      await authApi.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentRoomId');
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
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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
