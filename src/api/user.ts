import { client } from './axios';

const updateAvatar = async (formData: FormData) => {
  const avatarUrl = await client.post<{ avatarUrl: string }>(
    '/users/me/avatar',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return avatarUrl;
};

const deleteAvatar = async () => {
  await client.delete('/users/me/avatar');
};

export const userApi = { updateAvatar, deleteAvatar };
