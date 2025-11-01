import { client } from './axios';
import type { ChatMessageHistory } from './types/chat-message.interface';

export const getChatHistory = (roomId: string) =>
  client.get<ChatMessageHistory>(`/chat/${roomId}/messages`);
