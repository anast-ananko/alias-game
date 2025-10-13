import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import type { FC } from 'react';

const Game: FC = () => {
  const { gameId } = useParams();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Game: {gameId}
      </Typography>
      <Typography mb={2}>
        Word display, guesses, and chat will appear here.
      </Typography>
      {/* <Button
        component={Link}
        to={`/results/${gameId}`}
        variant="contained"
        color="primary"
      >
        View Results
      </Button> */}
    </Container>
  );
};

export default Game;
