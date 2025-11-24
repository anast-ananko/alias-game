import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import { socket } from '../socket';
import {
  getGame,
  startRound,
  startTurn,
  submitGuess,
  endGame,
  submitResult,
} from '../api/game';
import type { GuessDto } from '../types/game';
import { useParams } from 'react-router-dom';
import type { GameTeam } from '../types';

export interface GameState {
  gameId: string;
  currentRound: number;
  roomId: number;
  maxRounds: number;
  isFinished: boolean;
  teams: GameTeam[];
  turn: {
    teamId: string | null;
    round: number | null;
    endsAt: Date | null;
    wordId?: string | null;
    describerUserId?: string | null;
  } | null;
  expectedTeamId: string | null;
}

export interface ClientGameState extends GameState {
  currentWord?: string | null;
  lastGuessResult?: {
    result: 'correct' | 'forbidden' | 'skip';
    newScore: number;
  } | null;
  roundStarted: boolean;
}

interface GameContextValue {
  game: ClientGameState | null;
  setGame: React.Dispatch<React.SetStateAction<ClientGameState | null>>;
  startRoundHandler: () => void;
  startNextTurn: (teamId: string, durationSeconds: number) => Promise<void>;
  submitGuessHandler: (dto: GuessDto) => Promise<any>;
  endGameHandler: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams<{ id: string }>();
  const roomId = id || localStorage.getItem('currentRoomId');
  if (!roomId) throw new Error('RoomId is required for GameProvider');

  const [game, setGame] = useState<ClientGameState | null>(null);

  const fetchGameHandler = useCallback(async () => {
    if (!roomId) return;
    const res = await getGame(roomId);

    setGame({
      ...res,
      currentWord: null,
      roundStarted: res.currentRound === 1 ? true : false,
    });
  }, [roomId]);

  const startRoundHandler = async () => {
    const res = await startRound(roomId);

    setGame((prev) =>
      prev
        ? {
            ...prev,
            currentRound: res.currentRound,
            maxRounds: res.maxRounds,
            turn: null,
            currentWord: null,
            roundStarted: true,
            lastGuessResult: null,
          }
        : prev
    );
  };

  const startNextTurn = async (teamId: string, durationSeconds: number) => {
    const res = await startTurn(roomId, {
      teamId: String(teamId),
      durationSeconds,
    });

    setGame((prev) =>
      prev
        ? {
            ...prev,
            turn: {
              teamId: res.teamId,
              endsAt: res.endsAt,
              round: res.round,
              describerUserId: res.describerUserId ?? null,
            },
            currentWord: res.word.text || null,
          }
        : prev
    );
  };

  const submitGuessHandler = async (dto: GuessDto) => {
    try {
      const guessRes = await submitGuess(roomId, dto);

      if (guessRes.result === 'correct' || guessRes.result === 'forbidden') {
        await submitResult(roomId, {
          teamId: dto.teamId,
          result: guessRes.result,
          wordText: guessRes.currentWord?.text ?? null,
        });
      }

      return guessRes;
    } catch (err) {
      console.error('Error submitting guess:', err);
      throw err;
    }
  };

  const endGameHandler = useCallback(async () => {
    if (!roomId) return;
    await endGame(roomId);
  }, [roomId]);

  useEffect(() => {
    if (!id) return;

    socket.emit('room:join', { roomId: id });
  }, [id]);

  useEffect(() => {
    socket.on('game:started', ({ isFinished }) => {
      setGame((prev) => (prev ? { ...prev, isFinished } : prev));
    });

    socket.on('game:round:started', ({ round }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              currentRound: round,
              turn: null,
              roundStarted: true,
              currentWord: null,
            }
          : prev
      );
    });

    socket.on('game:round:completed', ({ round }) => {
      console.log(1);
      setGame((prev) =>
        prev
          ? {
              ...prev,
              roundStarted: false,
              currentRound: round,
            }
          : prev
      );
    });

    socket.on(
      'game:turn:started',
      ({ teamId, endsAt, round, describerUserId, word }) => {
        setGame((prev) =>
          prev
            ? {
                ...prev,
                turn: { teamId, endsAt, round, describerUserId },
                currentWord: word.text ?? null,
              }
            : prev
        );
      }
    );

    socket.on('game:turn:ended', ({ teamId }) => {
      setGame((prev) => {
        if (!prev) return prev;

        const currentIndex = prev.teams.findIndex((t) => t.id === teamId);
        const nextTeamIndex = (currentIndex + 1) % prev.teams.length;
        const expectedTeamId = prev.teams[nextTeamIndex]?.id ?? null;

        return {
          ...prev,
          turn: null,
          currentWord: null,
          expectedTeamId,
        };
      });
    });

    socket.on('game:ended', ({ finalScores }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              isFinished: true,
              turn: null,
              currentWord: null,
              teams: prev.teams.map((t) => ({
                ...t,
                score: finalScores[t.id] ?? t.score,
              })),
            }
          : prev
      );
    });

    socket.on('game:score:updated', ({ teamId, newScore }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              teams: prev.teams.map((t) =>
                t.id === teamId ? { ...t, score: newScore } : t
              ),
            }
          : prev
      );
    });

    socket.on('word:result:submitted', ({ teamId, delta, nextWord }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              teams: prev.teams.map((t) =>
                t.id === teamId ? { ...t, score: (t.score ?? 0) + delta } : t
              ),
              currentWord: nextWord ?? prev.currentWord,
            }
          : prev
      );
    });

    return () => {
      socket.off('game:round:started');
      socket.off('game:turn:started');
      socket.off('game:turn:ended');
      socket.off('game:score:updated');
      socket.off('word:result:submitted');
    };
  }, [id]);

  useEffect(() => {
    fetchGameHandler();
  }, [fetchGameHandler]);

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        startRoundHandler,
        startNextTurn,
        submitGuessHandler,
        endGameHandler,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
