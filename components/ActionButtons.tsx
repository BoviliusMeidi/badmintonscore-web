"use client";

import { JSX } from "react";
import IconButton from "./IconButton";
import NewMatchButton from "./NewButtonMatch";

/**
 * Props interface for the ActionButtons component.
 *
 * @property {() => void} onUndo - Callback function triggered when the Undo button is clicked.
 * @property {() => void} onPause - Callback function triggered when the Pause button is clicked.
 * @property {(players: { teamA: string[]; teamB: string[] }, firstServe: "A" | "B", firstServerName: string, opponentServerName: string, scoringSystemParam?: number) => void} onStartMatch
 * Function to start a new match. Includes player names, serve info, and optional scoring system parameter.
 */
interface ActionButtonsProps {
  onUndo: () => void;
  onPause: () => void;
  onStartMatch: (
    players: { teamA: string[]; teamB: string[] },
    firstServe: "A" | "B",
    firstServerName: string,
    opponentServerName: string,
    scoringSystemParam?: number
  ) => void;
}

/**
 * ActionButtons Component
 *
 * Displays a row of control buttons for the scoreboard:
 * - Undo: Reverts the last action.
 * - Pause: Pauses or resumes the match.
 * - New Match: Opens a new match setup modal or action.
 *
 * Layout:
 * - Horizontally aligned with responsive spacing.
 * - Centers all elements visually in the middle of the page.
 *
 * @param {ActionButtonsProps} props - Component properties.
 * @returns {JSX.Element} The rendered control button group.
 */
export default function ActionButtons({
  onUndo,
  onPause,
  onStartMatch,
}: ActionButtonsProps): JSX.Element {
  return (
    <div className="flex flex-row gap-6 md:gap-2 justify-center items-center text-black font-main">
      {/* Undo Button */}
      <IconButton icon="/undo.svg" alt="Undo" onAction={onUndo} />

      {/* Pause Button */}
      <IconButton icon="/pause.svg" alt="Pause" onAction={onPause} />

      {/* Start New Match Button */}
      <NewMatchButton onStartMatch={onStartMatch} />
    </div>
  );
}
