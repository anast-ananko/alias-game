import { Box, Container, Typography } from '@mui/material';
import type { FC } from 'react';

const Footer: FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 2,
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2">
          © {new Date().getFullYear()} Alias Game. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
