import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import AvatarWithHover from '../../components/AvatarWithHover';

import { updateProfile, changePassword } from '../../api/auth';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProfileChanged = username !== user?.username || email !== user?.email;
  const isPasswordChanged =
    passwords.currentPassword.trim() !== '' &&
    passwords.newPassword.trim() !== '';

  useEffect(() => {
    if (!user) return;

    setUsername(user.username);
    setEmail(user.email);
    setLoading(false);
  }, [user]);

  const handleSaveProfile = async (): Promise<void> => {
    setProfileError('');
    setProfileSuccess('');

    try {
      const updatedUser = await updateProfile({ username, email });
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

    setProfileError('');
    setProfileSuccess('');

    setEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await userApi.updateAvatar(formData);
      const newAvatarUrl = response.data.avatarUrl;

      if (user) updateUser({ ...user, avatarUrl: newAvatarUrl });
      setProfileSuccess('Avatar updated successfully');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setProfileError('Could not update avatar');
    } finally {
      // Reset input so user can re-upload same file if needed
      event.target.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Are you sure you want to delete your avatar?')) return;

    try {
      await userApi.deleteAvatar(); // calls DELETE /users/me/update-avatar
      if (user) updateUser({ ...user, avatarUrl: '' });
      setProfileSuccess('Avatar deleted successfully');
    } catch (err) {
      console.error('Error deleting avatar:', err);
      setProfileError('Could not delete avatar');
    }
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
          <AvatarWithHover
            avatarUrl={user.avatarUrl}
            onClick={handleAvatarClick}
            onDelete={handleDeleteAvatar}
            size={64}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

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

            {profileError && (
              <Typography color="error" variant="body2">
                {profileError}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSaveProfile}
                disabled={!isProfileChanged}
              >
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
            disabled={!isPasswordChanged}
          >
            Change Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
