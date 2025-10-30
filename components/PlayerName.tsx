"use client";

import Image from "next/image";
import { JSX } from "react";

/**
 * Props interface for the ScoreboardPlayers component.
 *
 * @property {{ teamA: string[]; teamB: string[] }} players - The player names for both teams (A and B).
 * @property {string} timer - The formatted match timer (e.g., "00:12:45").
 * @property {string | null} [currentServer] - The name of the player currently serving.
 * @property {string | null} [currentReceiver] - The name of the player currently receiver serve.
 */
interface PlayerNameProps {
  players: {
    teamA: string[];
    teamB: string[];
  };
  timer: string;
  currentServer?: string | null;
  currentReceiver?: string | null;
}

/**
 * PlayerName Component
 * ---
 * Displays both teams' player names and the match timer in the center.
 * Supports both singles and doubles matches.
 *
 * Features:
 * - Shows a shuttlecock icon beside the player who is currently serving.
 * - Automatically adjusts text sizes for singles or doubles.
 * - Uses responsive layout with TailwindCSS for both mobile and desktop.
 *
 * @param {PlayerNameProps} props - Component properties.
 * @returns {JSX.Element} A responsive scoreboard header showing player names and timer.
 */
export default function PlayerName({
  players,
  timer,
  currentServer,
  currentReceiver,
}: PlayerNameProps): JSX.Element {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center sm:gap-2 font-main tracking-widest">
      {/* === TEAM A SECTION === */}
      <div className="flex bg-secondary md:w-1/2 w-full justify-start items-center sm:mb-2 md:mb-0 sm:ml-20 border-white border-3">
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

                {/* Server & Receiver */}
                <div className="flex flex-row items-center gap-1">
                  {currentReceiver === name && (
                    <Image
                      src="/racket.svg"
                      alt="Receiver Indicator"
                      width={15}
                      height={15}
                      className={`${
                        players.teamA.length === 2
                          ? "w-4 h-4 sm:w-6 sm:h-6"
                          : "w-12 h-12"
                      }`}
                      priority
                    />
                  )}
                  {currentServer === name && (
                    <Image
                      src="/shuttlecock.svg"
                      alt="Serve Indicator"
                      width={15}
                      height={15}
                      className={`${
                        players.teamA.length === 2
                          ? "w-4 h-4 sm:w-6 sm:h-6"
                          : "w-12 h-12"
                      }`}
                      priority
                    />
                  )}
                </div>
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
      <div className="text-black text-lg sm:text-2xl font-main sm:px-4 py-1 sm:py-2 text-center w-full md:w-60">
        {timer}
      </div>

      {/* === TEAM B SECTION === */}
      <div className="flex items-center bg-secondary md:w-1/2 w-full justify-end sm:mt-2 md:mt-0 sm:mr-20 border-white border-3">
        {/* Team B player list */}
        <div className="flex flex-col justify-center w-full flex-1">
          {players.teamB.map((name, index) => (
            <div key={index} className="flex flex-col justify-center">
              <div className="flex flex-row items-center justify-between px-2">
                {/* Server & Receiver */}
                <div className="flex flex-row items-center gap-1">
                  {currentReceiver === name && (
                    <Image
                      src="/racket.svg"
                      alt="Receiver Indicator"
                      width={15}
                      height={15}
                      className={`${
                        players.teamB.length === 2
                          ? "w-4 h-4 sm:w-6 sm:h-6"
                          : "w-12 h-12"
                      }`}
                      priority
                    />
                  )}
                  {currentServer === name && (
                    <Image
                      src="/shuttlecock.svg"
                      alt="Serve Indicator"
                      width={15}
                      height={15}
                      className={`${
                        players.teamB.length === 2
                          ? "w-4 h-4 sm:w-6 sm:h-6"
                          : "w-12 h-12"
                      }`}
                      priority
                    />
                  )}
                </div>

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
