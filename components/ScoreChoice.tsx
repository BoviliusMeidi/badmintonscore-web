"use client";

import { useState } from "react";
import NewMatchModal from "./NewMatchModal";

/**
 * @typedef {object} Players
 * @description Defines the structure for the players object, containing arrays of names for each team.
 * @property {string[]} teamA - An array of player names for Team A.
 * @property {string[]} teamB - An array of player names for Team B.
 */
interface Players {
  teamA: string[];
  teamB: string[];
}

/**
 * @typedef {object} ScoreChoiceProps
 * @description Props for the ScoreChoiceButton component.
 *
 * @property {function} onStartMatch - Callback function passed to the `NewMatchModal`.
 * It is triggered when the user completes the match setup wizard.
 * @property {number | null} [presetScoring] - An optional preset scoring system (e.g., 15, 21, 30).
 * This value is displayed on the button and passed to the modal
 * to skip the scoring selection step.
 */
interface ScoreChoiceProps {
  /**
   * Callback function executed when the match setup is completed.
   *
   * @param {Players} players - The configured player names for both teams.
   * @param {"A" | "B"} firstServe - The side that will serve first.
   * @param {string} firstServerName - The name of the player serving first.
   * @param {string} opponentReceiverName - The name of the player receiving first.
   * @param {number} scoringSystem - The chosen scoring system.
   */
  onStartMatch: (
    players: Players,
    firstServe: "A" | "B",
    firstServerName: string,
    opponentReceiverName: string,
    scoringSystem: number
  ) => void;
  /** An optional preset scoring system (e.g., 15, 21, or 30). */
  presetScoring?: number | null;
}

/**
 * @summary
 * Renders a large, clickable button that displays a preset scoring option
 * and opens the `NewMatchModal` when clicked.
 *
 * @description
 * This component acts as a trigger. It manages the visibility state (`showModal`)
 * for the `NewMatchModal` and passes down the necessary props (`onStartMatch`, `presetScoring`)
 * to it.
 *
 * @param {ScoreChoiceProps} props - The component's props.
 * @returns {JSX.Element} A div containing the trigger button and the modal instance.
 */
export default function ScoreChoiceButton({
  onStartMatch,
  presetScoring = null,
}: ScoreChoiceProps) {
  /**
   * Internal state to control the visibility of the NewMatchModal.
   * @internal
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * Opens the new match modal by setting 'showModal' to true.
   * All internal state resets are handled by the NewMatchModal itself upon closing.
   * @internal
   */
  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* The main button visible on the page */}
      <button
        onClick={openModal}
        className="group font-secondary bg-primary text-white flex flex-col gap-2 justify-center items-center w-full grow hover:bg-hover transition duration-300 cursor-pointer relative z-0 before:content-[''] before:bg-center before:absolute before:inset-0 before:bg-[url('/shuttlecock-above.svg')] before:bg-no-repeat before:opacity-20 before:z-[-1]"
      >
        <p className="text-lg md:text-2xl">Score</p>
        <div className="w-px h-6 md:h-12 bg-white"></div>
        <p className="text-7xl md:text-9xl tracking-wider">{presetScoring}</p>
        <p className="font-secondary text-right text-xs md:text-sm absolute tracking-wider bottom-3 right-3">
          *Max Point {presetScoring === 15 ? 21 : 30}
        </p>
      </button>

      {/* The modal, rendered conditionally based on 'showModal' state */}
      <NewMatchModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onStartMatch={onStartMatch}
        presetScoring={presetScoring}
      />
    </div>
  );
}