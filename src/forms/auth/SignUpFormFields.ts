export const SIGNUP_FIELDS = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    autoComplete: 'username',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    autoComplete: 'new-password',
  },
] as const;
