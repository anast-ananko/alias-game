import type {
  ChangePasswordDto,
  LoginDto,
  LoginResponse,
  SignUpDto,
  SignUpResponse,
  UpdateProfileDto,
  User,
} from '../types/types';
import { api, client } from './axios';

export const signUp = async (data: SignUpDto) => {
  const res = await api.post<SignUpResponse>('/auth/signup', data, {
    withCredentials: true,
  });
  return res.data;
};

export const login = async (data: LoginDto) => {
  const res = await api.post<LoginResponse>('/auth/login', data, {
    withCredentials: true,
  });
  return res.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await client.get<User>('/users/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileDto): Promise<User> => {
  const response = await client.patch<User>('/users/me', data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordDto) => {
  const res = await client.patch('/users/me/password', data);
  return res.data;
};

export const logout = async () => {
  await client.get('/auth/logout', { withCredentials: true });
};

export const authApi = {
  signUp,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
};
