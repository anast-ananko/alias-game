import { Box, CircularProgress } from '@mui/material';
import type { FC } from 'react';

const Loader: FC = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
