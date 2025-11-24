import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Alert,
  Snackbar,
} from '@mui/material';

import { useGame } from '../../context/GameContext';
import { useAuth } from '../../hooks/useAuth';
import Chat from '../../components/Chat';

const GamePage = () => {
  const { id: roomId } = useParams<{ id: string }>();

  const { user } = useAuth();

  const {
    game,
    startRoundHandler,
    startNextTurn,
    submitGuessHandler,
    endGameHandler,
  } = useGame();

  const [guess, setGuess] = useState('');
  const [messages] = useState<{ user: string; text: string }[]>([]);
  const [timer, setTimer] = useState<number>(0);

  const [toast, setToast] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  const [toastOpen, setToastOpen] = useState(false);

  const currentTeam = game?.teams.find((t) => t.id === game?.turn?.teamId);
  const isMyTurn = !!user && currentTeam?.players.includes(user._id);

  const myTeamId = game?.teams.find((team) =>
    team.players?.some((p) => p === user?._id)
  )?.id;

  const isDescriber = !!user && game?.turn?.describerUserId === user._id;

  useEffect(() => {
    if (!game?.turn?.endsAt) {
      setTimer(0);
      setToastOpen(false);
      return;
    }

    const endsAt = new Date(game.turn.endsAt).getTime();
    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setTimer(timeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.turn?.endsAt]);

  useEffect(() => {
    const result = game?.lastGuessResult?.result;
    if (!result) return;

    if (result === 'correct') {
      setToast({ type: 'success', message: 'Correct' });
    } else if (result === 'forbidden') {
      setToast({ type: 'error', message: 'Forbidden word' });
    } else if (result === 'skip') {
      setToast({ type: 'info', message: 'Skipped' });
    }

    setToastOpen(true);
  }, [game?.lastGuessResult]);

  useEffect(() => {
    if (!game) return;

    if (
      game.currentRound === game.maxRounds &&
      !game.roundStarted &&
      !game.isFinished
    ) {
      endGameHandler();
    }
  }, [game, endGameHandler]);

  if (!roomId) return null;
  if (!game) return <Typography>Loading game...</Typography>;

  const handleStartRound = () => startRoundHandler();

  const handleStartTurn = async () => {
    if (!game || !user) return;

    const team = game.teams.find((t) => t.id === game.expectedTeamId);
    if (!team) return;

    await startNextTurn(team.id, 60);
  };

  const handleGuess = async () => {
    if (!game?.turn?.teamId || !user) return;

    const dto = {
      teamId: game.turn.teamId,
      wordText: '',
      guessText: guess,
    };

    try {
      const res = await submitGuessHandler(dto);
      setGuess('');

      if (res.result === 'correct') {
        setToast({ type: 'success', message: 'Correct' });
      } else if (res.result === 'forbidden') {
        setToast({ type: 'error', message: 'Forbidden word' });
      } else if (res.result === 'skip') {
        setToast({ type: 'info', message: 'Skipped' });
      }
      setToastOpen(true);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Error submitting guess' });
      setToastOpen(true);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {!game?.isFinished && (
        <>
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
            {game?.turn?.describerUserId &&
              user?._id === game.turn.describerUserId &&
              game?.currentWord && (
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
                    t.id === game?.expectedTeamId?.toString()
                      ? 'primary'
                      : 'default'
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
              disabled={myTeamId !== game.teams[0].id || game.roundStarted}
            >
              Start Round
            </Button>

            <>
              <Button
                variant="contained"
                onClick={handleStartTurn}
                disabled={
                  !game ||
                  game.expectedTeamId !== myTeamId || 
                  !!game.turn?.teamId || 
                  !game.roundStarted 
                }
              >
                Start Turn
              </Button>
            </>
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
                  disabled={isDescriber}
                />
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={handleGuess}
                  disabled={isDescriber}
                >
                  Send
                </Button>

                <Snackbar
                  open={toastOpen && !!toast}
                  autoHideDuration={3000}
                  onClose={() => setToastOpen(false)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Alert
                    onClose={() => setToastOpen(false)}
                    severity={toast?.type || 'info'}
                    variant="filled"
                    sx={{ width: '100%' }}
                  >
                    {toast?.message || ''}
                  </Alert>
                </Snackbar>
              </Box>
            )}
          </Paper>
        </>
      )}

      {game?.isFinished && (
        <Paper sx={{ p: 2, mt: 2, maxWidth: '400px' }}>
          <Typography variant="h6">Game finished 🎉</Typography>
          <Typography variant="body2">Final scoreboard:</Typography>
          {game.teams
            .slice()
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .map((t) => (
              <Box
                key={t.id}
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}
              >
                <Typography>{t.name}</Typography>
                <Typography>{t.score ?? 0}</Typography>
              </Box>
            ))}
        </Paper>
      )}

      <Chat roomId={roomId} />
    </Container>
  );
};

export default GamePage;
