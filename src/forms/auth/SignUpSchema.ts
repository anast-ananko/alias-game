import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email').nonempty('Email is required'),
    username: z.string().nonempty('Username is required'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .nonempty('Password is required'),
    confirmPassword: z.string().nonempty('Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
