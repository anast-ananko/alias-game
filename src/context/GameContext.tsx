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
  turn: {
    teamId: string | null;
    round: number | null;
    endsAt: Date | null;
    wordId?: string | null;
  } | null;
  expectedTeamId: string | null;
}

export interface ClientGameState extends GameState {
  currentWord?: string | null;
  lastGuessResult?: {
    result: 'correct' | 'forbidden' | 'skip';
    delta: number;
    newScore: number;
  } | null;
  allTeamsPlayedInRound: boolean;
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

  useEffect(() => {
    if (!game) return;

    const currentIndex = Number(
      game.expectedTeamId
        ? game.teams.findIndex((t) => t.id === game.expectedTeamId)
        : 0
    );

    const allTeamsPlayed =
      game.turn === null && currentIndex === 0 && game.currentRound > 0;

    setGame((prev) =>
      prev ? { ...prev, allTeamsPlayedInRound: allTeamsPlayed } : prev
    );
  }, [game?.expectedTeamId, game?.turn]);

  const fetchGameHandler = useCallback(async () => {
    if (!roomId) return;
    const res = await getGame(roomId);
    setGame({
      ...res,
      currentWord: null,
      allTeamsPlayedInRound: false,
    });
  }, [roomId]);

  const fetchScoreboardHandler = useCallback(async () => {
    if (!roomId || !game) return;
    const scores = await scoreboard(roomId);
    setGame((prev) => (prev ? { ...prev, scores } : prev));
  }, [roomId, game]);

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
            allTeamsPlayedInRound: false,
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
            turn: { teamId: res.teamId, endsAt: res.endsAt, round: res.round },
            currentWord: res.word?.text ?? null,
          }
        : prev
    );
  };

  const submitGuessHandler = async (dto: GuessDto) => {
    const res = await submitGuess(roomId, dto);
    console.log('guess result:', res);

    setGame((prev) =>
      prev
        ? {
            ...prev,
            currentWord: res.currentWord?.text ?? null,
            teams: prev.teams.map((t) =>
              t.id === dto.teamId ? { ...t, score: res.newScore } : t
            ),
          }
        : prev
    );
  };

  const endGameHandler = useCallback(async () => {
    if (!roomId) return;
    await endGame(roomId);
    setGame(null);
  }, [roomId]);

  useEffect(() => {
    if (!game) return;

    const currentIndex = game.expectedTeamId
      ? game.teams.findIndex((t) => t.id === game.expectedTeamId)
      : 0;

    if (game.currentRound === 0) return;

    const allTeamsPlayed =
      game.turn === null &&
      currentIndex === 0 &&
      game.expectedTeamId === game.teams[0].id;

    setGame((prev) =>
      prev && prev.allTeamsPlayedInRound !== allTeamsPlayed
        ? { ...prev, allTeamsPlayed }
        : prev
    );
  }, [game?.expectedTeamId, game?.turn, game?.currentRound]);

  useEffect(() => {
    if (!id) return;

    socket.emit('room:join', { roomId: id });
  }, [id]);

  useEffect(() => {
    socket.on('game:started', () => {
      setGame((prev) =>
        prev ? { ...prev, status: 'started', isFinished: false } : prev
      );
    });

    socket.on('game:round:started', ({ round }) => {
      setGame((prev) =>
        prev
          ? { ...prev, currentRound: round, turn: null, currentWord: null }
          : prev
      );
    });

    socket.on('game:round:completed', ({ round }) => {
      setGame((prev) =>
        prev
          ? { ...prev, allTeamsPlayedInRound: true, currentRound: round }
          : prev
      );
    });

    socket.on('game:turn:started', ({ teamId, endsAt, round }) => {
      setGame((prev) =>
        prev
          ? {
              ...prev,
              turn: { teamId, endsAt, round },
            }
          : prev
      );
    });

    socket.on('game:turn:ended', ({ teamId }) => {
      setGame((prev) => {
        if (!prev) return prev;

        const currentIndex = prev.teams.findIndex((t) => t.id === teamId);
        const nextTeamIndex = (currentIndex + 1) % prev.teams.length;
        const expectedTeamId = prev.teams[nextTeamIndex]?.id ?? null;

        const allTeamsPlayed = nextTeamIndex === 0;

        return {
          ...prev,
          turn: null,
          currentWord: null,
          expectedTeamId,
          allTeamsPlayedInRound: allTeamsPlayed,
        };
      });
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

    socket.on('game:wordResultSubmitted', ({ teamId, result, delta }) => {
      console.log('word result', teamId, result, delta);
    });

    return () => {
      socket.off('game:round:started');
      socket.off('game:turn:started');
      socket.off('game:turn:ended');
      socket.off('game:score:updated');
      socket.off('game:wordResultSubmitted');
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
        fetchScoreboardHandler,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
