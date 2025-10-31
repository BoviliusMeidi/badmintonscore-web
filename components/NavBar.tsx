"use client";
/**
 * This component is a client-side component because it contains interactive elements
 * such as click handlers.
 */

import Image from "next/image";
import NewMatchButton from "./NewButtonMatch";

/**
 * Props definition for the Navbar component.
 */
interface NavbarProps {
  /**
   * Callback function triggered when a scoring system is selected.
   * @param system - The selected scoring system value (e.g., 15, 21, or 30).
   */
  onStartMatch: (
    players: { teamA: string[]; teamB: string[] },
    firstServe: "A" | "B",
    firstServerName: string,
    opponentServerName: string,
    scoringSystemParam?: number
  ) => void;

  isMatchStarted: boolean;
}

/**
 * Navbar Component
 *
 * Displays the main navigation bar for the badminton score application.
 * It includes:
 * - A logo on the left.
 * - A set of circular buttons on the right for selecting the scoring system.
 *
 * The component is fixed at the top of the viewport and styled using Tailwind CSS.
 */
export default function Navbar({ onStartMatch, isMatchStarted }: NavbarProps) {
  return (
    <header className={`flex fixed top-0 flex-row ${isMatchStarted ? "justify-between" : "md:justify-end"} items-center bg-transparent text-black w-full font-main py-4 px-4 md:px-28 z-50`}>
      {/* Left section — Application logo */}
      <div className="flex items-center">
        <a href={"/"}>
          <Image
            src="logo-navbar.svg"
            width={180}
            height={180}
            className="w-18 md:w-36"
            alt="Badminton Score Logo"
          />
        </a>
      </div>
      {isMatchStarted && (
        <div className="flex gap-4 ">
          {[15, 21, 30].map((num) => (
            <NewMatchButton
              key={num}
              onStartMatch={onStartMatch}
              presetScoring={num}
              variant="text"
            />
          ))}
        </div>
      )}
    </header>
  );
}
