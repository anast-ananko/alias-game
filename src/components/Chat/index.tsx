import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  Avatar,
} from '@mui/material';
import { socket } from '../../socket';
import { SOCKET_EVENTS } from '../../types/socket-events';
import type { ChatProps } from './types';
import { getChatHistory } from '../../api/chat';
import type { ChatMessage } from '../../types/types';
import { useAuth } from '../../hooks';

export default function Chat({ roomId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    getChatHistory(roomId)
      .then(({ data }) => setMessages(data.messages))
      .catch((err) => console.error('Failed to load chat history:', err));

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    socket.emit(SOCKET_EVENTS.CHAT_NEW_MESSAGE, {
      roomId,
      content: input,
    });

    setInput('');
  };

  return (
    <Paper
      sx={{
        width: 400,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h6">Chat Room</Typography>

      <Box
        sx={{
          maxHeight: 300,
          flex: 1,
          overflowY: 'auto',
          px: 2,
          pb: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          // Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.2) transparent',
        }}
      >
        <List sx={{ p: 0, m: 0 }}>
          {messages.map((msg, idx) => {
            const isFirstOfGroup =
              idx === 0 || messages[idx - 1].user._id !== msg.user._id;

            const date = new Date(msg.createdAt).toLocaleDateString();

            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <ListItem
                key={idx}
                disableGutters
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: 0,
                  margin: 0,
                  marginTop: isFirstOfGroup ? '12px' : '2px',
                }}
              >
                {isFirstOfGroup ? (
                  <Avatar
                    src={msg.user.avatarUrl}
                    alt={msg.user.username}
                    sx={{ width: 40, height: 40, mr: 1 }}
                  />
                ) : (
                  <Box sx={{ width: 40, mr: 1 }} />
                )}

                <Box sx={{ flex: 1 }}>
                  {isFirstOfGroup && (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      <span
                        style={{
                          color:
                            msg.user._id === user?._id ? '#3BA55D' : '#5865F2',
                        }}
                      >
                        {msg.user.username}
                      </span>{' '}
                      <span
                        style={{
                          color: '#888',
                          fontSize: '0.75rem',
                          marginLeft: '4px',
                        }}
                      >
                        {date}, {time}
                      </span>
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Paper>
  );
}
