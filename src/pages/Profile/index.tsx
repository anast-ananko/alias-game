import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';

import { updateProfile, changePassword } from '../../api/auth';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    if (!user) return;

    setUsername(user.username);
    setEmail(user.email);
    setAvatarUrl(user.avatarUrl || '');
    setLoading(false);
  }, [user]);

  const handleSaveProfile = async (): Promise<void> => {
    setProfileError('');
    setProfileSuccess('');

    try {
      const updatedUser = await updateProfile({ username, email, avatarUrl });
      updateUser(updatedUser);
      setEditing(false);
      setProfileSuccess('Profile updated successfully');

      setTimeout(() => setProfileSuccess(''), 5000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setProfileError(
          err.response?.data?.message || 'Error updating profile'
        );
      } else if (err instanceof Error) {
        setProfileError(err.message);
      } else {
        setProfileError('Unexpected error updating profile');
      }

      setProfileSuccess('');
    }
  };

  const handleChangePassword = async (): Promise<void> => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setSuccessMessage('Password changed successfully');

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.message || 'Error changing password'
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unexpected error changing password');
      }

      setSuccessMessage('');
    }
  };

  const handleCancel = (): void => {
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');

    setProfileError('');
    setProfileSuccess('');

    setEditing(false);
  };

  if (loading)
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );

  if (!user)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>User not found</Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar src={avatarUrl} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography variant="h6">{user.email}</Typography>
            <Typography variant="body2" color="text.secondary">
              User ID: {user._id}
            </Typography>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Total games: {user.totalGames}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'success.main' }}
              >
                Total wins: {user.totalWins}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {editing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Avatar URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />

            {profileError && (
              <Typography color="error" variant="body2">
                {profileError}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSaveProfile}>
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Username: <strong>{user.username}</strong>
            </Typography>

            <Button variant="contained" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>

            {profileSuccess && (
              <Typography color="success.main" variant="body2" pt={2}>
                {profileSuccess}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Current Password"
            type="password"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
          <TextField
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
            }
          />

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

          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
