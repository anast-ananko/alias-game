import type { GuessDto, StartTurnDto, SubmitResultDto } from '../types/game';
import { client } from './axios';

export const getGame = async (roomId: string) => {
  const response = await client.get(`/rooms/${roomId}/game`);
  return response.data;
};

export const startRound = async (
  roomId: string
): Promise<{
  roomId: string;
  currentRound: number;
  maxRounds: number;
}> => {
  const response = await client.post(`/rooms/${roomId}/game/rounds/start`);
  return response.data;
};

export const startTurn = async (roomId: string, dto: StartTurnDto) => {
  const response = await client.post(`/rooms/${roomId}/game/turns/start`, dto);
  return response.data;
};

export const endTurn = async (roomId: string, teamId: string) => {
  const response = await client.post(`/rooms/${roomId}/game/turns/end`, {
    teamId,
  });
  return response.data;
};

export const submitGuess = async (roomId: string, dto: GuessDto) => {
  const response = await client.post(`/rooms/${roomId}/game/guess`, dto);
  return response.data;
};

export const submitResult = async (roomId: string, dto: SubmitResultDto) => {
  const response = await client.post(`/rooms/${roomId}/game/submit`, dto);
  return response.data;
};

export const getScoreboard = async (roomId: string) => {
  const response = await client.get(`/rooms/${roomId}/game/scoreboard`);
  return response.data;
};

export const endGame = async (roomId: string) => {
  const response = await client.post(`/rooms/${roomId}/game/end`);
  return response.data;
};
