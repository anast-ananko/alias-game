import { Box, Typography } from '@mui/material';

type Props = {
  isMine: boolean;
  showUsername: boolean;
  content: string;
  date: string;
  username?: string;
};

export function Message({ isMine, showUsername, username, content, date }: Props) {
  return (
    <Box
      sx={{
        maxWidth: '80%',
        backgroundColor: isMine ? '#1976d2' : '#e0e0e0',
        color: isMine ? '#fff' : '#000',
        borderRadius: 2,
        padding: '6px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMine ? 'flex-end' : 'flex-start',
      }}
    >
      {showUsername && !isMine && (
        <Typography
          variant="caption"
          sx={{ fontWeight: 'bold', marginBottom: '2px' }}
        >
          {username}
        </Typography>
      )}

      <Typography variant="body2">{content}</Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.7rem',
          opacity: 0.7,
          alignSelf: isMine ? 'flex-end' : 'flex-start',
        }}
      >
        {date}
      </Typography>
    </Box>
  );
}
