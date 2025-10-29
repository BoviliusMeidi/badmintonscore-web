"use client";

import Image from "next/image";
import { JSX } from "react";

/**
 * Props interface for the ScoreboardPlayers component.
 *
 * @property {{ teamA: string[]; teamB: string[] }} players - The player names for both teams (A and B).
 * @property {string} timer - The formatted match timer (e.g., "00:12:45").
 * @property {string | null} [currentServer] - The name of the player currently serving.
 */
interface ScoreboardProps {
  players: {
    teamA: string[];
    teamB: string[];
  };
  timer: string;
  currentServer?: string | null;
}

/**
 * ScoreboardPlayers Component
 * ---
 * Displays both teams' player names and the match timer in the center.
 * Supports both singles and doubles matches.
 *
 * Features:
 * - Shows a shuttlecock icon beside the player who is currently serving.
 * - Automatically adjusts text sizes for singles or doubles.
 * - Uses responsive layout with TailwindCSS for both mobile and desktop.
 *
 * @param {ScoreboardProps} props - Component properties.
 * @returns {JSX.Element} A responsive scoreboard header showing player names and timer.
 */
export default function ScoreboardPlayers({
  players,
  timer,
  currentServer,
}: ScoreboardProps): JSX.Element {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center px-2 sm:gap-2 font-main tracking-widest">
      {/* === TEAM A SECTION === */}
      <div className="flex bg-secondary md:w-1/3 w-full justify-start items-center sm:mb-2 md:mb-0 border-white border-3">
        {/* Team A logo */}
        <Image
          src="/logo-player.svg"
          width={40}
          height={40}
          alt="Logo Player A"
          className="p-0 sm:w-16 sm:h-16"
        />
        {/* Divider line */}
        <div className="bg-white w-1 h-12 sm:h-20" />

        {/* Team A player list */}
        <div className="flex flex-col justify-center w-full flex-1">
          {players.teamA.map((name, index) => (
            <div key={index} className="flex flex-col justify-center">
              <div className="flex flex-row items-center justify-between px-2">
                {/* Player name */}
                <p
                  className={`font-bold text-black text-right ${
                    players.teamA.length === 2
                      ? "text-xs md:text-2xl"
                      : "text-xl md:text-4xl"
                  }`}
                >
                  {name.toUpperCase()}
                </p>

                {/* Shuttlecock indicator (serve icon) */}
                {currentServer === name && (
                  <Image
                    src="/shuttlecock.svg"
                    alt="Serve Indicator"
                    width={15}
                    height={15}
                    className={`sm:w-6 sm:h-6 ${
                      players.teamA.length === 2
                        ? ""
                        : "w-12 h-12 sm:w-12 sm:h-12"
                    }`}
                    priority
                  />
                )}
              </div>

              {/* Divider between players (for doubles only) */}
              {index === 0 && players.teamA.length === 2 && (
                <div className="py-1">
                  <div className="h-1 w-full bg-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === TIMER SECTION === */}
      <div className="text-white text-lg sm:text-2xl font-mono sm:px-4 py-1 sm:py-2 text-center w-full md:w-auto">
        {timer}
      </div>

      {/* === TEAM B SECTION === */}
      <div className="flex items-center bg-secondary md:w-1/3 w-full justify-end sm:mt-2 md:mt-0 border-white border-3">
        {/* Team B player list */}
        <div className="flex flex-col justify-center w-full flex-1">
          {players.teamB.map((name, index) => (
            <div key={index} className="flex flex-col justify-center">
              <div className="flex flex-row items-center justify-between px-2">
                {/* Shuttlecock indicator (on left side) */}
                {currentServer === name ? (
                  <Image
                    src="/shuttlecock.svg"
                    alt="Serve Indicator"
                    width={15}
                    height={15}
                    className={`sm:w-6 sm:h-6 ${
                      players.teamB.length === 2
                        ? ""
                        : "w-12 h-12 sm:w-12 sm:h-12"
                    }`}
                    priority
                  />
                ) : (
                  // Spacer for alignment
                  <div className="w-6 sm:w-8" />
                )}

                {/* Player name */}
                <p
                  className={`font-bold text-black text-right ${
                    players.teamB.length === 2
                      ? "text-xs md:text-2xl"
                      : "text-xl md:text-4xl"
                  }`}
                >
                  {name.toUpperCase()}
                </p>
              </div>

              {/* Divider between players (for doubles only) */}
              {index === 0 && players.teamB.length === 2 && (
                <div className="py-1">
                  <div className="h-1 w-full bg-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider line & Team B logo */}
        <div className="bg-white w-1 h-12 sm:h-20" />
        <Image
          src="/logo-player.svg"
          width={40}
          height={40}
          alt="Logo Player B"
          className="p-0 sm:w-16 sm:h-16"
        />
      </div>
    </div>
  );
}
