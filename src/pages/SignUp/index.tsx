import { Container, Typography, Box, TextField, Button } from '@mui/material';
import type { FC } from 'react';

const SignUp: FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sign Up
      </Typography>
      <Box component="form" display="flex" flexDirection="column" gap={2}>
        <TextField label="Username" variant="outlined" />
        <TextField label="Password" type="password" variant="outlined" />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
        />
        <Button variant="contained" color="primary">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
