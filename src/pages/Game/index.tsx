import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../hooks/useAuth';
import type { GameTeam } from '../../types';
import Chat from '../../components/Chat';

const GamePage = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    game,
    startRoundHandler,
    startNextTurn,
    submitGuessHandler,
    endGameHandler,
  } = useGame();

  const [guess, setGuess] = useState('');
  const [messages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [timer, setTimer] = useState<number>(0);
  // const [currentWord, setCurrentWord] = useState<string | null>(null);

  const currentTeamIndex = game?.currentTeamIndex ?? 0;

  const currentTeam: GameTeam | undefined = game?.teams[currentTeamIndex];

  const isMyTurn = !!user && !!currentTeam?.players.some((p) => p === user._id);

  useEffect(() => {
    if (!game?.turn?.endsAt) return;

    const endsAt = new Date(game.turn.endsAt).getTime();

    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setTimer(timeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.turn?.endsAt]);

  if (!roomId) return null;
  if (!game) return <Typography>Loading game...</Typography>;

  const handleStartRound = () => startRoundHandler();

  const handleStartTurn = async () => {
    if (!game) return;

    const team = game.teams[game.currentTeamIndex || 0];
    if (!team) return;

    startNextTurn(team.id, 10);
  };

  // const handleEndTurn = async () => {
  //   if (!currentTeamIndex) return;
  //   await endTurn(roomId, currentTeamIndex.toString());
  // };

  const handleGuess = async () => {
    // if (!game?.turn?.teamId) return;

    // await submitGuessHandler({
    //   teamId: game.turn.teamId,
    //   wordText: currentWord ?? '',
    //   guessText: guess,
    // });

    submitGuessHandler({
      teamId: '6905f981d1e8742192e8fdc5',
      wordText: 'mamba',
      guessText: guess,
    });

    setGuess('');

    console.log(1);
  };

  const handleEndGame = async () => {
    await endGameHandler();
    navigate(`/room/${roomId}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">
          Round {game.currentRound} / {game.maxRounds}
        </Typography>
        <Typography variant="h5" color="primary">
          ⏱ {timer}s
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: isMyTurn
            ? '#d8f8e0'
            : currentTeam
              ? '#fff7d6'
              : '#f0f0f0',
          border: '2px solid',
          borderColor: isMyTurn
            ? 'success.main'
            : currentTeam
              ? 'warning.main'
              : 'grey.300',
        }}
      >
        <Typography variant="h6">
          Current Team: {currentTeam?.name ?? '—'}
          {isMyTurn ? '(Your turn!)' : currentTeam ? '(Playing now)' : null}
        </Typography>
        {isMyTurn && game?.currentWord && (
          <Typography variant="body1" color="secondary">
            Word to guess: {game.currentWord}
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Scoreboard</Typography>
        {game.teams.map((t) => (
          <Box
            key={t.id}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
          >
            <Chip
              label={t.name}
              color={
                t.id === currentTeamIndex.toString() ? 'primary' : 'default'
              }
            />
            <Typography>{t.score ?? 0}</Typography>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={handleStartRound}
          disabled={!game?.allTeamsPlayedInRound}
        >
          Start Round
        </Button>
        {/* 
        {isMyTurn && ( */}
        <>
          <Button variant="contained" onClick={handleStartTurn}>
            Start Turn
          </Button>
          {/* <Button variant="outlined" onClick={handleEndTurn}>
            End Turn
          </Button> */}
        </>
        {/* )} */}

        <Button color="error" variant="outlined" onClick={handleEndGame}>
          End Game
        </Button>
      </Box>

      <Paper sx={{ p: 2, my: 3, maxHeight: 250, overflowY: 'auto' }}>
        <Typography variant="h6">Guess</Typography>
        <List dense>
          {messages.map((m, i) => (
            <ListItem key={i}>
              <ListItemText primary={`${m.user}: ${m.text}`} />
            </ListItem>
          ))}
        </List>

        {isMyTurn && (
          <Box sx={{ display: 'flex', mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess..."
            />
            <Button variant="contained" sx={{ ml: 1 }} onClick={handleGuess}>
              Send
            </Button>
          </Box>
        )}
      </Paper>

      <Chat roomId={roomId} />
    </Container>
  );
};

export default GamePage;
