import { io, Socket } from 'socket.io-client';

const token = localStorage.getItem('accessToken');

export const socket: Socket = io('http://localhost:3000', {
  auth: {
    token,
  },
});
