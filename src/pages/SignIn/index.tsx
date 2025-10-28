import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

import {
  SIGNIN_FIELDS,
  signInSchema,
  type SignInFormData,
} from '../../forms/auth';
import { useAuth } from '../../hooks';

const SignIn: FC = () => {
  const { login, error } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async (formData: SignInFormData) => {
    await login(formData);
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
        onSubmit={handleSubmit(onSubmit)}
      >
        {SIGNIN_FIELDS.map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={field.label}
                type={field.type}
                autoComplete={field.autoComplete}
                variant="outlined"
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            )}
          />
        ))}

        {error && (
          <Typography color="error.main" variant="body2">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
