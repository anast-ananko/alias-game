import { useEffect, type FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

import {
  SIGNUP_FIELDS,
  signUpSchema,
  type SignUpFormData,
} from '../../forms/auth';
import { useAuth } from '../../hooks/useAuth';

const SignUpPage: FC = () => {
  const { signup, error, setError } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (error) {
      const subscription = watch(() => {
        setError(null);
      });
      return () => subscription.unsubscribe();
    }
  }, [error, watch, setError]);

  const onSubmit = async (formData: SignUpFormData) => {
    await signup(formData);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sign Up
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        {SIGNUP_FIELDS.map((field) => (
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
            {error}{' '}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default SignUpPage;
