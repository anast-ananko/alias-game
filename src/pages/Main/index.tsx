import { Container, Typography, Button, Stack } from '@mui/material';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

const Main: FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Typography mb={2}>List of rooms or create/join buttons go here</Typography>
      <Stack direction="row" spacing={2}>
        <Button component={Link} to="/lobby/123" variant="contained" color="primary">
          Enter Lobby Example
        </Button>
      </Stack>
    </Container>
  );
};

export default Main;
