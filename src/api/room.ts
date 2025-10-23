import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/rooms',
});

export const getRooms = () => api.get('/');
export const createRoom = (name: string, createdBy: string) =>
  api.post('/', { name, createdBy });
export const getRoomById = (id: string) => api.get(`/${id}`);
export const deleteRoom = (id: string) => api.delete(`/${id}`);
