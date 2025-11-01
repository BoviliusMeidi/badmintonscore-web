"use client";

import PlayerName from "@/components/PlayerName";
import ScoreBoard from "@/components/ScoreBoard";
import ActionButtons from "@/components/ActionButtons";
import IconButton from "@/components/IconButton";
import Pause from "@/components/Pause";

/**
 * Props interface for the MatchInterface component.
 * This defines all the state and handlers required from the parent Page.
 */
interface MatchInterfaceProps {
  players: { teamA: string[]; teamB: string[] };
  formatTime: (time: number) => string;
  time: number;
  currentServer: string | null;
  currentReceiver: string | null;
  pointsA: number;
  setsA: number;
  pointsB: number;
  setsB: number;
  handleIncrement: (side: "A" | "B") => void;
  isPaused: boolean;
  serverSide: "A" | "B" | null;
  handleUndo: () => void;
  handlePause: () => void;
  handleStartMatch: (
    newPlayers: { teamA: string[]; teamB: string[] },
    firstServe: "A" | "B",
    firstServerName: string,
    opponentReceiverName: string,
    scoringSystemParam?: number
  ) => void;
  setShowMatchHistoryModal: (show: boolean) => void;
  handleResume: () => void;
}

/**
 * MatchInterface Component
 *
 * This component renders the primary user interface for an active match.
 * It consolidates various sub-components to display:
 * - Player names and serve/receive indicators (`PlayerName`)
 * - The main scoreboards for each team (`ScoreBoard`)
 * - Control buttons for undo, pause, new match (`ActionButtons`)
 * - The match history button (`IconButton`)
 * - The pause overlay (`Pause`)
 *
 * It manages the responsive layout, showing a full header on desktop
 * and splitting the header on mobile.
 *
 * @param {MatchInterfaceProps} props - The collected state and handlers from the main Page component.
 * @returns {JSX.Element} A React fragment containing the active match UI.
 */
export default function MatchInterface({
  players,
  formatTime,
  time,
  currentServer,
  currentReceiver,
  pointsA,
  setsA,
  pointsB,
  setsB,
  handleIncrement,
  isPaused,
  serverSide,
  handleUndo,
  handlePause,
  handleStartMatch,
  setShowMatchHistoryModal,
  handleResume,
}: MatchInterfaceProps) {
  return (
    <>
      {/* Desktop Player Name Header */}
      <div className="mt-6 w-full justify-center hidden sm:block">
        <PlayerName
          players={players}
          timer={formatTime(time)}
          currentServer={currentServer}
          currentReceiver={currentReceiver}
        />
      </div>

      {/* Main Scoreboards (A and B) */}
      <div className="flex flex-col sm:flex-row items-center sm:gap-0 md:mt-4 w-full">
        <ScoreBoard
          side="A"
          points={pointsA}
          sets={setsA}
          onIncrement={handleIncrement}
          disabled={isPaused}
          isServing={serverSide === "A"}
        />
        {/* Mobile Player Name Header (In-between scoreboards) */}
        <div className="block w-full sm:hidden">
          <PlayerName
            players={players}
            timer={formatTime(time)}
            currentServer={currentServer}
            currentReceiver={currentReceiver}
          />
        </div>
        <ScoreBoard
          side="B"
          points={pointsB}
          sets={setsB}
          onIncrement={handleIncrement}
          disabled={isPaused}
          isServing={serverSide === "B"}
        />
      </div>

      {/* Control Buttons Section */}
      <div className="mt-3 sm:mt-5 flex flex-col items-center w-full">
        <ActionButtons
          onUndo={handleUndo}
          onPause={handlePause}
          onStartMatch={handleStartMatch}
        />
        {/* History Button (Positioned absolutely) */}
        <div className="absolute right-5">
          <IconButton
            icon="/history.svg"
            alt="History Match"
            onAction={() => setShowMatchHistoryModal(true)}
          />
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && <Pause handleResume={handleResume} />}
    </>
  );
}