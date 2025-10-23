import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

import { getRooms, createRoom } from '../../api/room';
import type { Room } from '../../types/types';

const MainPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const navigate = useNavigate();
  const userId = '651234567890abcdef123456';

  const fetchRooms = async (): Promise<void> => {
    const res = await getRooms();
    setRooms(res.data);
  };

  const handleCreateRoom = async (): Promise<void> => {
    if (!newRoomName) return;
    await createRoom(newRoomName, userId);
    setNewRoomName('');
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rooms
      </Typography>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <TextField
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          label="New room"
          variant="outlined"
          sx={{ mr: 2, flex: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateRoom}>
          Create Room
        </Button>
      </Box>

      <List>
        {rooms.map((room) => (
          <Paper key={room._id} sx={{ mb: 1 }}>
            <ListItem
              secondaryAction={
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate(`/room/${room._id}`)}
                >
                  Join Room
                </Button>
              }
            >
              <ListItemText primary={room.name} />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
};

export default MainPage;
