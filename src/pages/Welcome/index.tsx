import { Button, Container, Typography, Stack } from '@mui/material';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

const Welcome: FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome to Alias Game
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sign in or sign up to start playing.
      </Typography>
      <Stack direction="row" spacing={2} mt={2}>
        <Button
          component={Link}
          to="/sign-in"
          variant="contained"
          color="primary"
        >
          Sign In
        </Button>
        <Button
          component={Link}
          to="/sign-up"
          variant="contained"
          color="success"
        >
          Sign Up
        </Button>
      </Stack>
    </Container>
  );
};

export default Welcome;
