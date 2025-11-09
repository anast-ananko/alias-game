import { Box, Avatar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

interface AvatarWithHoverProps {
  avatarUrl: string;
  onClick: () => void;
  onDelete?: () => void;
  size?: number;
}

const AvatarWithHover = ({
  avatarUrl,
  onClick,
  onDelete,
  size = 64,
}: AvatarWithHoverProps) => {
  const [hover, setHover] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        cursor: 'pointer',
        borderRadius: '50%',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <Avatar src={avatarUrl} sx={{ width: size, height: size }} />

      {/* Hover edit overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.4)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <EditIcon />
      </Box>

      {/* Delete button */}
      {avatarUrl && onDelete && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering onClick for file upload
            onDelete();
          }}
          sx={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': { bgcolor: 'error.dark' },
            width: 24,
            height: 24,
          }}
        >
          <DeleteIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default AvatarWithHover;
