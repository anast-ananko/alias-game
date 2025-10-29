import { client } from './axios';
import type { Room } from '../types/types';

export const getRooms = async (): Promise<Room[]> => {
  const response = await client.get<Room[]>('/rooms');
  return response.data;
};

export const createRoom = async (
  name: string,
  createdBy: string
): Promise<Room> => {
  const response = await client.post<Room>('/rooms', { name, createdBy });
  return response.data;
};

export const getRoomById = async (id: string): Promise<Room> => {
  const response = await client.get<Room>(`/rooms/${id}`);
  return response.data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await client.delete(`/rooms/${id}`);
};
