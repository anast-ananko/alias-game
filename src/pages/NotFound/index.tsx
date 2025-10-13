import { Container, Typography, Button } from '@mui/material';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 20, textAlign: 'center' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;
