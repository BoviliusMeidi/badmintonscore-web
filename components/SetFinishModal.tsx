"use client";

import GameStatsView from "./GameStatsView";

/**
 * @typedef {object} PointSnapshot
 * @description Represents a complete snapshot of the match state at a single point in time.
 * @remarks
 * This type MUST be kept in sync with the `PointSnapshot` type defined in `Page.tsx`.
 *
 * @property {number} pointsA - Current points for Team A.
 * @property {number} setsA - Current sets won by Team A.
 * @property {number} pointsB - Current points for Team B.
 * @property {number} setsB - Current sets won by Team B.
 * @property {"A" | "B" | null} serverSide - The side currently serving.
 * @property {string | null} currentServer - The name of the player currently serving.
 * @property {string | null} currentReceiver - The name of the player currently receiving.
 * @property {string | null} nextServer - The name of the next player in the serve rotation.
 * @property {number} serveIndex - The current index in the serveOrder array.
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
 * @typedef {object} GameSnapshot
 * @description Represents a completed or in-progress game (set).
 * @remarks
 * This type MUST be kept in sync with the `GameSnapshot` type in `Page.tsx`.
 *
 * @property {number} gameNumber - The sequential number of the game (e.g., 1, 2, 3).
 * @property {number} pointsA - The final points for Team A in this game.
 * @property {number} pointsB - The final points for Team B in this game.
 * @property {"A" | "B" | null} winnerSide - The winner of the game. 'null' if in progress.
 * @property {number} duration - The duration of the game in seconds.
 * @property {PointSnapshot[]} pointHistory - An array of all point snapshots recorded during this game.
 */
type GameSnapshot = {
  gameNumber: number;
  pointsA: number;
  pointsB: number;
  winnerSide: "A" | "B" | null;
  duration: number;
  pointHistory: PointSnapshot[];
};
// ---

/**
 * Props for the SetFinishModal component.
 */
interface SetFinishModalProps {
  show: boolean;
  gameData: GameSnapshot | null;
  players: { teamA: string[]; teamB: string[] };
  scoringSystem: number;
  currentServer: string | null;
  onSetCurrentServer: (server: string) => void;
  currentReceiver: string | null;
  onSetCurrentReceiver: (receiver: string) => void;
  onContinue: () => void;
}

/**
 * @summary
 * A modal that appears when a game (set) is completed.
 *
 * @description
 * This component displays the final statistics for the completed game using the
 * `GameStatsView` component.
 *
 * For doubles matches (`isDoubles`), it also renders dropdown menus to allow
 * the user to select the starting server (from the winning team) and receiver
 * (from the losing team) for the next set. These dropdowns are
 * controlled components, with their state managed by the parent `Page`.
 *
 * @param {SetFinishModalProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered modal or `null` if `show` is false.
 */
export default function SetFinishModal({
  show,
  gameData,
  players,
  scoringSystem,
  currentServer,
  onSetCurrentServer,
  currentReceiver,
  onSetCurrentReceiver,
  onContinue,
}: SetFinishModalProps) {
  // Do not render if the modal is hidden or has no data
  if (!show || !gameData) return null;

  const isDoubles = players.teamA.length > 1 || players.teamB.length > 1;
  const winnerTeam =
    gameData.winnerSide === "A" ? players.teamA : players.teamB;
  const loserTeam = gameData.winnerSide === "A" ? players.teamB : players.teamA;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 font-main text-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 1. Display stats for the completed game */}
        <GameStatsView
          game={gameData}
          players={players}
          scoringSystem={scoringSystem}
        />

        {/* 2. Display server/receiver selection (for doubles only) */}
        {isDoubles && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div>
              <label className="block mb-1 font-semibold">
                Next Server (Winner: Team {gameData.winnerSide}):
              </label>
              <select
                className="border p-2 rounded w-full"
                value={currentServer || winnerTeam[0]}
                onChange={(e) => onSetCurrentServer(e.target.value)}
              >
                {winnerTeam.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mt-2 mb-1 font-semibold">
                Next Receiver (Loser):
              </label>
              <select
                className="border p-2 rounded w-full"
                value={currentReceiver || loserTeam[0]}
                onChange={(e) => onSetCurrentReceiver(e.target.value)}
              >
                {loserTeam.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 3. Continue Button */}
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors sm:text-lg cursor-pointer"
          onClick={onContinue}
        >
          Continue to Next Set
        </button>
      </div>
    </div>
  );
}