export interface User {
  _id: string;
  email: string;
  username: string;
  totalGames: number;
  totalWins: number;
}

export interface Team {
  _id: string;
  name: string;
  score: number;
  players: string[];
}

export interface Room {
  _id: string;
  name: string;
  members: string[];
  phase: 'waiting' | 'inGame' | 'finished';
  activeGameId: string | null;
  createdBy: string;
  teams: Team[];
}
