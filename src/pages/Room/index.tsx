import { useEffect, useState, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Avatar,
} from '@mui/material';

import { socket } from '../../socket';
import { getRoomById } from '../../api/room';
import type { Room } from '../../types/types';
import { useAuth } from '../../context/AuthContext';

const RoomPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(id!);
        setRoom(res);
      } catch (error) {
        console.error('Error loading room:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    localStorage.setItem('currentRoomId', id);

    socket.connect();
    socket.emit('room:join', { roomId: id, userId });

    socket.on('room:members:update', ({ room: updatedRoom }) => {
      setRoom(updatedRoom);
    });

    socket.on('team:created', ({ room: updatedRoom }) => {
      setRoom(updatedRoom);
    });

    socket.on('team:deleted', ({ room: updatedRoom }) => {
      setRoom(updatedRoom);
    });

    socket.on('team:updated', ({ room: updatedRoom }) => {
      setRoom(updatedRoom);
    });

    socket.on('ws-error', console.error);

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading)
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading room...</Typography>
      </Container>
    );

  if (!room)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Room not found</Typography>
      </Container>
    );

  const userTeam = userId
    ? room.teams?.find((t) => t.players.some((p) => p._id === userId))
    : undefined;

  const handleLeaveRoom = () => {
    if (!room?._id) return;
    socket.emit('room:leave', { roomId: room._id, userId });
    navigate('/main');
  };

  const handleCreateTeam = () => {
    if (!teamName) return;
    socket.emit('team:create', {
      roomId: id,
      name: teamName,
    });
    setTeamName('');
  };

  const handleDeleteTeam = (teamId: string) => {
    socket.emit('team:delete', {
      roomId: id,
      teamId,
    });
    setTeamName('');
  };

  const handleJoinTeam = (teamId: string) => {
    socket.emit('team:assign', { roomId: id, teamId, userId });
  };

  const handleLeaveTeam = () => {
    if (!userTeam) return;
    socket.emit('team:remove', { roomId: id, teamId: userTeam._id, userId });
  };

  const handleStartGame = () => {
    // add some rules to check before start
    //socket.emit('room:start', { roomId: id, maxRounds: 5 });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {room.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Created by: {room.createdBy?.username ?? 'Unknown'}
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={handleLeaveRoom}
        sx={{ mb: 3 }}
      >
        Leave room
      </Button>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Status</Typography>
        {userTeam ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography>
              You are in team:{' '}
              <Box
                component="span"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                {userTeam.name}
              </Box>
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLeaveTeam}
              sx={{ ml: 2 }}
            >
              Leave team
            </Button>
          </Box>
        ) : (
          <Typography sx={{ mt: 1 }}>You are not in team</Typography>
        )}
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Teams</Typography>
        <List>
          {room.teams?.map((team) => (
            <Paper key={team._id} sx={{ mb: 1, p: 1 }}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {userId && !team.players.some((p) => p._id === userId) && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleJoinTeam(team._id)}
                      >
                        Join team
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTeam(team._id)}
                      disabled={room.createdBy._id !== userId}
                    >
                      Delete
                    </Button>
                  </Box>
                }
              >
                <ListItemText
                  primary={team.name}
                  secondary={
                    <Box
                      sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}
                    >
                      {team.players.map((p) => (
                        <Chip
                          key={p._id}
                          label={
                            p.username + (p._id === userId ? ' (You)' : '')
                          }
                          color={p._id === userId ? 'primary' : 'default'}
                          size="small"
                        />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>

        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            label="New team"
            variant="outlined"
            sx={{ mr: 2, flex: 1 }}
          />
          <Button variant="contained" onClick={handleCreateTeam}>
            Create Team
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">All players</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {room.members.map((m) => (
            <Box
              key={m._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                padding: '2px 6px',
                borderRadius: 1,
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
            >
              <Avatar
                src={m.avatarUrl}
                alt={m.username}
                sx={{ width: 20, height: 20 }}
              />
              <Typography variant="body2">{m.username}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Divider sx={{ my: 2 }} />
      <Button variant="contained" color="success" onClick={handleStartGame}>
        Start
      </Button>
    </Container>
  );
};

export default RoomPage;
