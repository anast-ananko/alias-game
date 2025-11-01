import type { ChatMessage } from '../../types/types';

export interface ChatMessageHistory {
  roomId: string;
  count: number;
  messages: ChatMessage[];
}
