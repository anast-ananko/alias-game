export interface StartTurnDto {
  teamId: string;
  durationSeconds: number;
}

export interface GuessDto {
  teamId: string;
  wordText: string;
  guessText: string;
}

export interface SubmitResultDto {
  teamId: string;
  result: 'correct' | 'skip' | 'forbidden';
  wordText?: string;
  overrideDelta?: number;
}

export interface StartGameDto {
  roomId: string;
  teams: {
    name: string;
    playerIds: string[];
  }[];
  maxRounds: number;
}

