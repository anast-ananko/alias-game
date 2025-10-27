import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const Header: FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLougout = async () => {
    await logout();
    navigate('/', { replace: true });
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

          <Box>
            {isAuthenticated && (
              <>
                <Button color="inherit" component={Link} to="/main">
                  Main
                </Button>
                <Button color="inherit" onClick={handleLougout}>
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
