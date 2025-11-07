export interface User {
  _id: string;
  email: string;
  username: string;
  avatarUrl: string;
  totalGames: number;
  totalWins: number;
  accessToken: string;
  refreshToken: string;
}

export interface Team {
  _id: string;
  name: string;
  score: number;
  players: {
    _id: string;
    username: string;
    email: string;
  }[];
}

export interface GameTeam {
  id: string;
  name: string;
  score: number;
  players: string[];
}

export interface Room {
  _id: string;
  name: string;
  members: {
    _id: string;
    username: string;
    email: string;
    avatarUrl: string;
  }[];
  phase: 'waiting' | 'inGame' | 'finished';
  activeGameId: string | null;
  createdBy: {
    _id: string;
    username: string;
  };
  teams: Team[];
}

export interface SignUpDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface SignUpResponse {
  user: User;
  accessToken: string;
}

export interface ChatMessage {
  _id: string;
  room: Pick<Room, '_id' | 'name'>;
  user: Pick<User, '_id' | 'username' | 'avatarUrl'>;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Word {
  text: string;
  category: string;
}
