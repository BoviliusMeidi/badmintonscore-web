"use client";

import { useState } from "react";
import Image from "next/image";
import { calculateMatchStats, MatchStats } from "@/utils/statsUtils";
import GameStatsView from "./GameStatsView";

/**
 * Represents a single point snapshot in a game's history.
 * NOTE: This type definition must be kept in sync with Page.tsx.
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
 * NOTE: This type definition must be kept in sync with Page.tsx.
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
 * Props for the MatchHistoryModal component.
 */
interface MatchHistoryModalProps {
  show: boolean;
  onClose: () => void;
  matchHistory: GameSnapshot[];
  players: { teamA: string[]; teamB: string[] };
  scoringSystem: number;
  onReset: () => void;
}

/**
 * Helper function to format duration (only used in this component)
 */
const formatDuration = (seconds: number) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  return `${hrs}:${mins}`;
};

/**
 * MatchHistoryModal Component
 * ---
 * A modal that displays detailed match statistics.
 */
export default function MatchHistoryModal({
  show,
  onClose,
  matchHistory,
  players,
  scoringSystem,
  onReset,
}: MatchHistoryModalProps) {
  // State to manage the currently active tab. Defaults to "matchStats".
  const [activeTab, setActiveTab] = useState("matchStats");

  if (!show) return null;

  // Calculate overall match stats ONLY if the "matchStats" tab is active.
  let matchStats: MatchStats | null = null;
  let totalDuration = 0; // <--- (BARU) Variabel untuk total durasi
  if (activeTab === "matchStats") {
    matchStats = calculateMatchStats(matchHistory, scoringSystem);
    // <--- (BARU) Hitung total durasi ---
    totalDuration = matchHistory.reduce((acc, game) => acc + game.duration, 0);
    // ---
  }

  // Find the active game snapshot if a "game-X" tab is selected.
  const activeGameNumber = activeTab.startsWith("game-")
    ? parseInt(activeTab.split("-")[1])
    : null;
  const activeGame = activeGameNumber
    ? matchHistory.find((g) => g.gameNumber === activeGameNumber)
    : null;

  const teamAName = players.teamA.join(" & ");
  const teamBName = players.teamB.join(" & ");

  return (
    <div className="fixed inset-0 font-main text-black bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="flex flex-col gap-2 bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-lg hover:bg-gray-200 cursor-pointer p-1"
        >
          <Image src={"/close.svg"} width={30} height={30} alt="Close Button" />
        </button>

        {/* Modal Header */}
        <h2 className="text-lg sm:text-3xl flex justify-center items-center gap-2 font-bold mb-4">
          <Image
            src={"/history.svg"}
            width={40}
            height={40}
            alt="Match History"
          />
          Match History
        </h2>

        {/* Modal Content */}
        {matchHistory.length === 0 ? (
          <p className="sm:text-xl text-center">No match history available.</p>
        ) : (
          <div className="flex flex-col overflow-y-auto">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-300 mb-4 overflow-x-auto">
              <TabButton
                label="Match Stats"
                isActive={activeTab === "matchStats"}
                onClick={() => setActiveTab("matchStats")}
              />
              {matchHistory.map((game) => (
                <TabButton
                  key={game.gameNumber}
                  label={`Game ${game.gameNumber}${
                    game.winnerSide === null ? " (In)" : ""
                  }`}
                  isActive={activeTab === `game-${game.gameNumber}`}
                  onClick={() => setActiveTab(`game-${game.gameNumber}`)}
                />
              ))}
            </div>

            {/* Statistics Display Area */}
            <div className="overflow-y-auto">
              {/* Overall Match Stats View */}
              {activeTab === "matchStats" && matchStats && (
                <div className="space-y-4 px-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">
                    Overall Match Stats
                  </h3>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2 sm:text-lg">
                    <div className="font-bold text-gray-600">Statistic</div>
                    <div className="font-bold text-center text-green">
                      {teamAName}
                    </div>
                    <div className="font-bold text-center text-yellow">
                      {teamBName}
                    </div>

                    <div className="text-gray-600">Total Points Won</div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.totalPointsWonA}
                    </div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.totalPointsWonB}
                    </div>

                    <div className="text-gray-600">Most Consecutive Points</div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.mostConsecutivePointsA}
                    </div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.mostConsecutivePointsB}
                    </div>

                    <div className="text-gray-600">Game Points</div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.gamePointsA}
                    </div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.gamePointsB}
                    </div>

                    <div className="text-gray-600">
                      Total Points Played
                    </div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.totalPointsPlayed - 1}
                    </div>
                    <div className="text-center text-xl font-semibold">
                      {matchStats.totalPointsPlayed - 1}
                    </div>

                    <div className="text-gray-600 col-span-2">
                      Total Duration
                    </div>
                    <div className="text-center text-xl font-semibold">
                      {formatDuration(totalDuration)}
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Game Stats View */}
              {activeGame && (
                <GameStatsView
                  game={activeGame}
                  players={players}
                  scoringSystem={scoringSystem}
                />
              )}
            </div>
          </div>
        )}

        {/* Modal Footer (Reset Button) */}
        <div className="mt-4 flex justify-end sm:text-xl border-t pt-4">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer flex justify-center items-center gap-2 hover:bg-red-600 transition-colors disabled:bg-gray-400"
            onClick={onReset}
            disabled={matchHistory.length === 0}
          >
            <Image
              src={"/reset.svg"}
              width={30}
              height={30}
              alt="Reset History"
            />
            Reset History
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Props for the TabButton component.
 */
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * A simple, reusable button component styled for use in a tab navigation bar.
 * ... (rest of JSDoc) ...
 */
function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 font-semibold whitespace-nowrap ${
        isActive
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}