import { io, Socket } from 'socket.io-client';

const token = localStorage.getItem('accessToken');

export const socket: Socket = io('https://alias-game-q2g6.onrender.com', {
  auth: {
    token,
  },
});
