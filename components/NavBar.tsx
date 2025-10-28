"use client";
/**
 * This component is a client-side component because it contains interactive elements
 * such as click handlers.
 */

import Image from "next/image";

/**
 * Props definition for the Navbar component.
 */
interface NavbarProps {
  /**
   * Callback function triggered when a scoring system is selected.
   * @param system - The selected scoring system value (e.g., 15, 21, or 30).
   */
  onSelectScoring: (system: number) => void;
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
export default function Navbar({ onSelectScoring }: NavbarProps) {
  return (
    <header className="fixed top-0 flex flex-row justify-between items-center bg-navbar text-black w-full font-main py-4 px-4 md:px-28 z-50">
      {/* Left section — Application logo */}
      <div className="flex items-center">
        <Image
          src="logo-navbar.svg"
          width={180}
          height={180}
          className="w-18 md:w-36"
          alt="Badminton Score Logo"
        />
      </div>

      {/* Right section — Scoring system buttons */}
      <div className="flex flex-row">
        {/* Generate buttons dynamically for scoring options: 15, 21, 30 */}
        {[15, 21, 30].map((num) => (
          <button
            key={num} // Unique key for React rendering
            onClick={() => onSelectScoring(num)} // Invoke callback with selected score system
            className="bg-white flex justify-center items-center rounded-full md:p-4 mx-1 md:mx-4 w-8 h-8 md:w-16 md:h-16 hover:bg-black hover:text-white transition duration-300"
          >
            {/* Button text displaying the scoring value */}
            <p className="text-sm md:text-3xl font-semibold tracking-wider">{num}</p>
          </button>
        ))}
      </div>
    </header>
  );
}
