"use client";

import { useState } from "react";
import Image from "next/image";
import NewMatchModal from "./NewMatchModal";

/**
 * Represents the player configuration for a match.
 */
interface Players {
  /** An array of player names for Team A (left side). */
  teamA: string[];
  /** An array of player names for Team B (right side). */
  teamB: string[];
}

/**
 * Props for the NewMatch component.
 */
interface NewMatchProps {
  /**
   * The callback function to be executed when the match setup is successfully completed
   * within the modal. This function passes the setup data up to the parent page.
   *
   * @param players - The configured player names for both teams.
   * @param firstServe - The side ('A' or 'B') that will serve first.
   * @param firstServerName - The name of the player serving first (Even player).
   * @param opponentReceiverName - The name of the player receiving first (Even player).
   * @param scoringSystem - The chosen scoring system (e.g., 15, 21, 30).
   */
  onStartMatch: (
    players: Players,
    firstServe: "A" | "B",
    firstServerName: string,
    opponentReceiverName: string,
    scoringSystem: number
  ) => void;
  /**
   * An optional preset scoring system. If provided, the "text" variant
   * will display this number, and the modal will skip the scoring selection step.
   */
  presetScoring?: number | null;
  /**
   * The visual style of the button.
   * - `"icon"`: Displays a "forward" icon (default).
   * - `"text"`: Displays the `presetScoring` value.
   * @default "icon"
   */
  variant?: "icon" | "text";
}

/**
 * @summary
 * A client component that renders a button to trigger the new match setup process.
 *
 * @description
 * This component acts as the entry point for starting a new match. It manages the
 * visibility state (`showModal`) for the {@link NewMatchModal} component.
 * It can be rendered in two styles, "icon" (default) or "text" (showing a preset score),
 * based on the `variant` prop.
 *
 * @param {NewMatchProps} props - The props for the component.
 * @returns {JSX.Element} A fragment containing the trigger button and the modal instance.
 */
export default function NewMatch({
  onStartMatch,
  presetScoring = null,
  variant = "icon",
}: NewMatchProps) {
  /**
   * State to control the visibility of the NewMatchModal.
   * @internal
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * Opens the new match modal by setting the `showModal` state to true.
   * @internal
   */
  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center">
      {/* New Match Button Trigger */}
      <button
        onClick={openModal}
        className={`group bg-icon ${
          variant === "icon"
            ? "" // Default icon styling
            : "bg-white hover:bg-hover hover:text-yellow text-green border-yellow hover:border-green border-4" // Text variant styling
        } flex justify-center items-center rounded md:p-4 mx-1 md:mx-4 w-12 h-12 md:w-18 md:h-18 transition duration-300 cursor-pointer`}
      >
        {variant === "icon" ? (
          // Icon Variant
          <Image
            src="/forward.svg"
            width={25}
            height={25}
            alt="New Match Icon"
            className=" w-8 h-8 sm:w-16 sm:h-16 transition duration-300 group-hover:filter group-hover:invert group-hover:brightness-0 group-hover:saturate-0"
          />
        ) : (
          // Text (Score) Variant
          <p className="text-lg md:text-3xl font-semibold tracking-wider">
            {presetScoring}
          </p>
        )}
      </button>

      {/* The Modal Component */}
      <NewMatchModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onStartMatch={onStartMatch}
        presetScoring={presetScoring}
      />
    </div>
  );
}
