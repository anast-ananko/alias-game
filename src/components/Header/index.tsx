import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
} from '@mui/material';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';



const Header: FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/sign-in');
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            Alias Game
          </Typography>

          <Box display="flex" gap={2} alignContent="center">
            <Button color="inherit" component={Link} to="/main">
              Main
            </Button>
            {!isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/sign-in">
                  Sign In
                </Button>
                <Button color="inherit" component={Link} to="/sign-up">
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                    },
                  }}
                  onClick={() => navigate('/profile')}
                >
                  <Avatar
                    src={user?.avatarUrl}
                    alt={user?.username}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body1">{user?.username}</Typography>
                </Box>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
