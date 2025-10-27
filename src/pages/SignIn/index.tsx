import { useState, type FC } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import axios from 'axios';

import { signIn } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const SignIn: FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { user, accessToken } = await signIn({ usernameOrEmail, password });

      login(user, accessToken);

      setSuccessMessage('Logged in successfully!');
      setErrorMessage('');

      setUsernameOrEmail('');
      setPassword('');

      setTimeout(() => setSuccessMessage(''), 5000);

      console.log('✅ Logged in successfully:', { user, accessToken });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data?.message || 'Login failed');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Login failed');
      }

      setSuccessMessage('');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sign In
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={2}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success.main" variant="body2">
            {successMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SignIn;
