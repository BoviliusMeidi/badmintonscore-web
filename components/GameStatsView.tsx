"use client";

import { calculateGameStats, GameStats } from "@/utils/statsUtils";
import PointGraph from "./PointGraph";

/**
 * Represents a snapshot of the match state at a single point in time.
 * NOTE: This type must be kept in sync with the 'PointSnapshot' type in Page.tsx.
 */
type PointSnapshot = {
  pointsA: number;
  setsA: number;
  pointsB: number;
  setsB: number;
  serverSide: "A" | "B" | null;
  currentServer: string | null;
  currentReceiver: string | null;
  nextServer: string | null;
  serveIndex: number;
};

/**
 * Represents a completed or in-progress game (set).
 * NOTE: This type must be kept in sync with the 'GameSnapshot' type in Page.tsx.
 */
type GameSnapshot = {
  gameNumber: number;
  pointsA: number;
  pointsB: number;
  winnerSide: "A" | "B" | null;
  duration: number;
  pointHistory: PointSnapshot[];
};

/**
 * Props for the GameStatsView component.
 */
interface GameStatsViewProps {
  game: GameSnapshot;
  players: { teamA: string[]; teamB: string[] };
  scoringSystem: number;
}

/**
 * @summary
 * A reusable component that displays detailed statistics and a point flow graph
 * for a single game.
 *
 * @description
 * This component calculates and renders a statistics table (Total Points,
 * Consecutive Streaks, Game Points) and a `PointGraph` for a given game
 * snapshot. It is designed to be used within other modals, such as
 * `MatchHistoryModal` and `SetFinishModal`.
 *
 * @param {GameStatsViewProps} props - The properties required to render the game stats.
 * @returns {JSX.Element} A div element containing the formatted game statistics.
 */
export default function GameStatsView({
  game,
  players,
  scoringSystem,
}: GameStatsViewProps) {
  // Calculate stats for this specific game
  const stats: GameStats = calculateGameStats(game, scoringSystem);
  const teamAName = players.teamA.join(" & ");
  const teamBName = players.teamB.join(" & ");

  return (
    <div className="space-y-4 px-1">
      {/* 1. Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-center">
        Game {game.gameNumber} Stats{" "}
        {game.winnerSide === null
          ? "(In Progress)"
          : `(${game.pointsA} - ${game.pointsB})`}
      </h3>

      {/* 2. Statistics Table */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 sm:text-lg">
        <div className="font-bold text-gray-600">Statistic</div>
        <div className="font-bold text-center text-green">{teamAName}</div>
        <div className="font-bold text-center text-yellow">{teamBName}</div>

        <div className="text-gray-600">Total Points Won</div>
        <div className="text-center text-xl font-semibold">
          {stats.totalPointsWonA}
        </div>
        <div className="text-center text-xl font-semibold">
          {stats.totalPointsWonB}
        </div>

        <div className="text-gray-600">Most Consecutive Points</div>
        <div className="text-center text-xl font-semibold">
          {stats.mostConsecutivePointsA}
        </div>
        <div className="text-center text-xl font-semibold">
          {stats.mostConsecutivePointsB}
        </div>

        <div className="text-gray-600">Game Points</div>
        <div className="text-center text-xl font-semibold">
          {stats.gamePointsA}
        </div>
        <div className="text-center text-xl font-semibold">
          {stats.gamePointsB}
        </div>

        <div className="text-gray-600 col-span-2">Total Points Played</div>
        <div className="text-center text-xl font-semibold">
          {game.winnerSide === null && stats.totalPointsPlayed > 0
            ? `${stats.totalPointsPlayed}` // Show current count
            : `${stats.totalPointsPlayed - 1}`}
        </div>
      </div>

      {/* 3. Point Flow Graph */}
      <div className="pt-4 border-t">
        <PointGraph pointHistory={game.pointHistory} players={players} />
      </div>
    </div>
  );
}
