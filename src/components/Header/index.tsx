import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

const Header: FC = () => {
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
            <Button color="inherit" component={Link} to="/main">
              Main
            </Button>
            <Button color="inherit" component={Link} to="/sign-in">
              Sign In
            </Button>
            <Button color="inherit" component={Link} to="/sign-up">
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
