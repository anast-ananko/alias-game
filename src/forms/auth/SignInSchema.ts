import { z } from 'zod';

export const signInSchema = z.object({
  usernameOrEmail: z.string().nonempty('Username or Email is required'),
  password: z.string().nonempty('Password is required'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
