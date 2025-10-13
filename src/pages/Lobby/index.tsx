import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import type { FC } from 'react';

const Lobby: FC = () => {
  const { roomId } = useParams();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Lobby: {roomId}
      </Typography>
      <Typography mb={2}>Players, teams, and chat will be here.</Typography>
      <Button component={Link} to="/game/456" variant="contained" color="success">
        Start Game Example
      </Button>
    </Container>
  );
};

export default Lobby;
