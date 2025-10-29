"use client";
/**
 * This component represents an individual scoreboard for one side (A or B)
 * in a badminton match. It displays the player's points, sets,
 * and indicates who is currently serving.
 */

import Image from "next/image";
import React from "react";

/**
 * Props for the ScoreBoard component.
 */
interface ScoreBoardProps {
  /** Indicates which side this scoreboard represents ("A" or "B"). */
  side: "A" | "B";

  /** Current number of points for this side. */
  points: number;

  /** Current number of sets won by this side. */
  sets: number;

  /**
   * Callback function triggered when the scoreboard is clicked.
   * Used to increment points and sets.
   *
   * @param side - The side ("A" or "B") that was clicked.
   * @param points - The updated number of points.
   * @param sets - The updated number of sets.
   */
  onIncrement: (side: "A" | "B", points: number, sets: number) => void;

  /** Disables interaction if true. */
  disabled?: boolean;

  /** Shows a shuttlecock indicator if the player is serving. */
  isServing?: boolean;
}

/**
 * ScoreBoard Component
 *
 * Displays a team's current points and sets in a styled card.
 * Clicking on the card increments the score unless disabled.
 */
export default function ScoreBoard({
  side,
  points,
  sets,
  onIncrement,
  disabled = false,
  isServing = false,
}: ScoreBoardProps) {
  /**
   * Handles a click event on the scoreboard.
   * Increments the score unless the board is disabled.
   */
  const handleScore = () => {
    if (disabled) return;

    let newPoints = points + 1;
    let newSets = sets;

    // When reaching 21 points, reset points and increment sets (max 5)
    if (newPoints > 21) {
      newPoints = 0;
      if (newSets < 5) newSets += 1;
    }

    // Trigger callback with updated values
    onIncrement(side, newPoints, newSets);
  };

  return (
    <div
      role="button"
      onClick={handleScore}
      className={`relative font-main flex flex-col justify-center items-center ${side === "A" ? "bg-white text-black" : "bg-black text-white"}
       p-4 sm:p-6 m-3 sm:m-4 rounded-3xl cursor-pointer transition duration-150 hover:scale-105 w-64 h-52 sm:w-48 md:w-100 md:h-100`}
      aria-label={`Scoreboard for side ${side}`}
    >
      {/* === Serving Indicator === */}
      {isServing && (
        <div className="absolute top-5 right-3 bg-primary rounded-full p-3 shadow-md animate-bounce">
          <Image
            src="/shuttlecock.svg"
            width={35}
            height={35}
            alt="Shuttlecock Serve Indicator"
            className="sm:w-10 sm:h-10"
          />
        </div>
      )}

      {/* === Score Display === */}
      <div className="py-12 sm:py-12 px-12 sm:px-12 ">
        <p className="text-8xl md:text-scoreboard font-bold tracking-wider text-center select-none">
          {String(points).padStart(2, "0")}
        </p>
      </div>

      {/* === Set Counter === */}
      <div className="absolute bottom-3 left-3 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-secondary rounded-full">
        <p className="text-base sm:text-lg md:text-xl text-black font-semibold tracking-widest select-none">
          {sets > 0 ? "I".repeat(Math.min(sets, 5)) : "-"}
        </p>
      </div>
    </div>
  );
}
