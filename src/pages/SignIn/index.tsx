import { Container, Typography, Box, TextField, Button } from '@mui/material';
import type { FC } from 'react';

const SignIn: FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sign In
      </Typography>
      <Box component="form" display="flex" flexDirection="column" gap={2}>
        <TextField label="Username" variant="outlined" />
        <TextField label="Password" type="password" variant="outlined" />
        <Button variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
