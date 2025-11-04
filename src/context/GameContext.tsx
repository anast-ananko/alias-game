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
  endTurn,
  submitGuess,
  // submitResult,
  scoreboard,
  endGame,
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
}

export interface ClientGameState extends GameState {
  currentTeamIndex: number | null;
  turn?: {
    teamId: string;
    endsAt: string;
  } | null;
  currentWord?: string;
  allTeamsPlayedInRound?: boolean;
}

interface GameContextValue {
  game: ClientGameState | null;
  //setGame: (game: ClientGameState) => void;
  setGame: React.Dispatch<React.SetStateAction<ClientGameState | null>>;
  startRoundHandler: () => void;
  startNextTurn: (teamId: string, durationSeconds: number) => void;
  submitGuessHandler: (dto: GuessDto) => void;
  endGameHandler: () => void;
  fetchScoreboardHandler: () => void;
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
      currentTeamIndex: 0,
      turn: null,
      currentWord: undefined,
      allTeamsPlayedInRound: false,
    });
  }, [roomId]);

  const fetchScoreboardHandler = useCallback(async () => {
    if (!roomId || !game) return;
    const scores = await scoreboard(roomId);
    setGame((prev) => (prev ? { ...prev, scores } : prev));
  }, [roomId, game]);

  const startRoundHandler = async () => {
    await startRound(roomId);

    setGame((prev) =>
      prev
        ? {
            ...prev,
            currentTeamIndex: 0,
            turn: null,
          }
        : prev
    );
  };

  const startNextTurn = async (teamId: string, durationSeconds: number) => {
    await startTurn(roomId, {
      teamId: String(teamId),
      durationSeconds,
    });

    setTimeout(async () => {
      await endTurn(roomId, teamId);
    }, durationSeconds * 1000);
  };

  const submitGuessHandler = async (dto: GuessDto) => {
    await submitGuess(roomId, dto);

  };

  const endGameHandler = useCallback(async () => {
    if (!roomId) return;
    await endGame(roomId);
    setGame(null);
  }, [roomId]);

  // --- SOCKET EVENTS ---
  useEffect(() => {
    socket.on('game:started', () => {
      setGame((prev) =>
        prev ? { ...prev, status: 'started', isFinished: false } : prev
      );
    });

    // socket.on('game:round:started', ({ currentRound }) => {
    //   setGame((prev) => (prev ? { ...prev, currentRound } : prev));
    // });

    // socket.on('game:turn:started', ({ teamId, endsAt }) => {
    //   setGame((prev) =>
    //     prev
    //       ? {
    //           ...prev,
    //           turn: { teamId, endsAt },
    //           status: 'in_turn',
    //         }
    //       : prev
    //   );
    // });

    // socket.on('game:turn:ended', () => {
    //   setGame((prev) =>
    //     prev
    //       ? { ...prev, turn: null, currentWord: undefined, status: 'started' }
    //       : prev
    //   );
    // });

    socket.on('game:round:started', ({ currentRound }) => {
      setGame((prev) =>
        prev ? { ...prev, currentRound, allTeamsPlayedInRound: false } : prev
      );
    });

    socket.on('game:turn:started', ({ teamId, endsAt, currentTeamIndex }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              turn: { teamId, endsAt },
              currentTeamIndex,
              status: 'in_turn',
            }
          : prev
      );
    });

    socket.on('game:turn:ended', ({ nextTeamIndex, allTeamsPlayedInRound }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              turn: null,
              currentTeamIndex: nextTeamIndex,
              allTeamsPlayedInRound,
              status: 'started',
              currentWord: undefined,
            }
          : prev
      );
    });

    socket.on('game:ended', ({ finalScores }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              isFinished: true,
              status: 'ended',
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

    socket.on('game:ended', ({ finalScores }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              isFinished: true,
              status: 'ended',
              teams: prev.teams.map((t) => ({
                ...t,
                score: finalScores[t.id] ?? t.score,
              })),
            }
          : prev
      );
    });

    return () => {
      socket.off('game:started');
      socket.off('game:round:started');
      socket.off('game:turn:started');
      socket.off('game:turn:ended');
      socket.off('game:score:updated');
      socket.off('game:ended');
    };
  }, [roomId]);

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
        fetchScoreboardHandler,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
