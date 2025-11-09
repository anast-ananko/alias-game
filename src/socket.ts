import { io, Socket } from 'socket.io-client';
import { APP_ENV } from './config';

const socketURL = APP_ENV.SOCKET_URL;

export const socket: Socket = io(socketURL, { autoConnect: false });
