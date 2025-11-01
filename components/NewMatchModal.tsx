"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Defines the structure for the players object.
 * @internal
 */
interface Players {
  teamA: string[];
  teamB: string[];
}

/**
 * Defines the structure for the player name form data.
 * @internal
 */
type FormData = {
  teamA1: string;
  teamA2: string;
  teamB1: string;
  teamB2: string;
};

/**
 * Defines the possible steps in the multi-step modal.
 * @internal
 */
type Step = "mode" | "scoring" | "players" | "serve" | "selectServer";

/**
 * Props accepted by the NewMatchModal component.
 */
interface NewMatchModalProps {
  /** Controls whether the modal is visible. */
  show: boolean;
  /** Callback function to be invoked when the modal should close. */
  onClose: () => void;
  /**
   * Callback function executed when the user completes the setup and starts the match.
   * @param players - The configured player names for both teams.
   * @param firstServe - The side ('A' or 'B') that will serve first.
   * @param firstServerName - The name of the player serving first.
   * @param opponentReceiverName - The name of the player receiving first.
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
   * An optional preset scoring system.
   * If provided, the "scoring" step will be skipped.
   */
  presetScoring?: number | null;
}

/**
 * @summary
 * A self-contained, multi-step modal (wizard) for configuring and starting a new match.
 *
 * @description
 * This component manages its own internal state for the setup process, including
 * match mode (single/doubles), player names, and server/receiver selection.
 * When the user completes the final step, it calls the `onStartMatch` prop
 * with the complete match configuration.
 *
 * @param {NewMatchModalProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered modal or `null` if `show` is false.
 */
export default function NewMatchModal({
  show,
  onClose,
  onStartMatch,
  presetScoring = null,
}: NewMatchModalProps) {
  // --- Internal Modal State ---
  const [mode, setMode] = useState<"single" | "ganda">("single");
  const [scoringSystem, setScoringSystem] = useState<number | null>(
    presetScoring
  );
  const [formData, setFormData] = useState<FormData>({
    teamA1: "",
    teamA2: "",
    teamB1: "",
    teamB2: "",
  });
  const [step, setStep] = useState<Step>("mode");
  const [firstServe, setFirstServe] = useState<"A" | "B" | null>(null);
  const [firstServerName, setFirstServerName] = useState("");
  const [firstReceiverName, setFirstReceiverName] = useState("");

  /**
   * @summary
   * Resets all internal modal states to their default values and calls the `onClose` prop.
   * @description
   * Uses a `setTimeout` to delay the state reset, allowing time for
   * potential modal exit animations to complete.
   */
  const handleClose = () => {
    onClose();
    // Reset state after the modal is closed (delay for animation)
    setTimeout(() => {
      setStep("mode");
      setMode("single");
      setScoringSystem(presetScoring);
      setFormData({ teamA1: "", teamA2: "", teamB1: "", teamB2: "" });
      setFirstServe(null);
      setFirstServerName("");
      setFirstReceiverName("");
    }, 300); // Adjust this delay to match your exit transition
  };

  /**
   * @summary
   * Gathers all internal state, validates it, formats it, and calls `onStartMatch`.
   * @description
   * This function formats the player names based on the selected mode and default
   * values. It determines the final server/receiver names and then
   * triggers the `onStartMatch` prop before closing the modal.
   */
  const handleStart = () => {
    if (!mode || !firstServe || !scoringSystem) return;

    const players: Players =
      mode === "single"
        ? {
            teamA: [formData.teamA1 || "Player 1"],
            teamB: [formData.teamB1 || "Player 2"],
          }
        : {
            teamA: [
              formData.teamA1 || "Team A.1",
              formData.teamA2 || "Team A.2",
            ],
            teamB: [
              formData.teamB1 || "Team B.1",
              formData.teamB2 || "Team B.2",
            ],
          };

    let serveName = "";
    let receiverName = "";

    if (mode === "single") {
      // For singles, server and receiver are determined automatically
      serveName = firstServe === "A" ? players.teamA[0] : players.teamB[0];
      receiverName = firstServe === "A" ? players.teamB[0] : players.teamA[0];
    } else {
      // For doubles, use the selected names
      if (!firstServerName || !firstReceiverName) return;
      serveName = firstServerName;
      receiverName = firstReceiverName;
    }

    onStartMatch(players, firstServe, serveName, receiverName, scoringSystem);
    handleClose(); // Close modal after starting
  };

  // Do not render anything if the modal is not supposed to be shown
  if (!show) {
    return null;
  }

  // Render the modal JSX
  return (
    <div className="fixed inset-0 flex items-center font-main justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 rounded-lg hover:bg-gray-200 cursor-pointer p-1"
        >
          <Image src={"/close.svg"} width={35} height={35} alt="Close Button" />
        </button>

        {/* Step 1: Select Mode */}
        {step === "mode" && (
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl font-bold mb-4">
              Select Match Mode
            </h2>
            <div className="flex justify-center sm:text-xl gap-6">
              <button
                onClick={() => {
                  setMode("single");
                  setStep(presetScoring ? "players" : "scoring");
                }}
                className="bg-green text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
              >
                Single
              </button>
              <button
                onClick={() => {
                  setMode("ganda");
                  setStep(presetScoring ? "players" : "scoring");
                }}
                className="bg-yellow text-black px-4 py-2 rounded-md hover:bg-yellow-500 cursor-pointer"
              >
                Doubles
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Scoring (if not preset) */}
        {!presetScoring && step === "scoring" && (
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl font-bold mb-4">
              Select Scoring System
            </h2>

            {/* --- Tombol 15, 21, 30 --- */}
            <div className="flex flex-col gap-3 sm:text-xl mb-6">
              <button
                onClick={() => setScoringSystem(15)}
                className={`px-6 py-3 rounded-md transition-colors ${
                  scoringSystem === 15
                    ? "bg-blue-600 text-white" // Warna aktif
                    : "bg-gray-200 hover:bg-gray-300" // Warna non-aktif
                }`}
              >
                15 Points (Max 21)
              </button>
              <button
                onClick={() => setScoringSystem(21)}
                className={`px-6 py-3 rounded-md transition-colors ${
                  scoringSystem === 21
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                21 Points (Max 30)
              </button>
              <button
                onClick={() => setScoringSystem(30)}
                className={`px-6 py-3 rounded-md transition-colors ${
                  scoringSystem === 30
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                30 Points (Max 30)
              </button>
            </div>
            {/* --- Akhir Tombol --- */}

            <div className="flex justify-between mt-6 sm:text-2xl">
              <button
                onClick={() => setStep("mode")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!scoringSystem) return;
                  setStep("players");
                }}
                disabled={!scoringSystem}
                className={`px-6 py-2 rounded-md cursor-pointer ${
                  scoringSystem
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter Player Names */}
        {step === "players" && (
          <div className="mt-6">
            <h3 className="text-lg sm:text-3xl font-semibold mb-3 text-center">
              Enter Player Names
            </h3>
            <div className="flex flex-col sm:text-xl gap-4">
              {/* Team 1 */}
              <div>
                <h4 className="font-bold mb-2">
                  {mode === "single"
                    ? "Player 1 (Left Team)"
                    : "Team 1 (Left Team)"}
                </h4>
                <input
                  type="text"
                  placeholder="Player 1 Name"
                  value={formData.teamA1}
                  onChange={(e) =>
                    setFormData({ ...formData, teamA1: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                />
                {mode === "ganda" && (
                  <input
                    type="text"
                    placeholder="Player 2 Name"
                    value={formData.teamA2}
                    onChange={(e) =>
                      setFormData({ ...formData, teamA2: e.target.value })
                    }
                    className="border p-2 rounded-md mt-2 w-full"
                  />
                )}
              </div>
              {/* Team 2 */}
              <div>
                <h4 className="font-bold mb-2">
                  {mode === "single"
                    ? "Player 2 (Right Team)"
                    : "Team 2 (Right Team)"}
                </h4>
                <input
                  type="text"
                  placeholder="Player 1 Name"
                  value={formData.teamB1}
                  onChange={(e) =>
                    setFormData({ ...formData, teamB1: e.target.value })
                  }
                  className="border p-2 rounded-md w-full"
                />
                {mode === "ganda" && (
                  <input
                    type="text"
                    placeholder="Player 2 Name"
                    value={formData.teamB2}
                    onChange={(e) =>
                      setFormData({ ...formData, teamB2: e.target.value })
                    }
                    className="border p-2 rounded-md mt-2 w-full"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between mt-6 sm:text-2xl">
              <button
                onClick={() => {
                  if (presetScoring) setStep("mode");
                  else setStep("scoring");
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep("serve")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Select First Serving Team */}
        {step === "serve" && (
          <div className="text-center mt-4 ">
            <h3 className="text-lg sm:text-3xl font-semibold mb-4">
              Select Team to Serve First
            </h3>
            <div className="flex sm:text-xl justify-center gap-6">
              <button
                onClick={() => setFirstServe("A")}
                className={`px-6 py-3 rounded-md ${
                  firstServe === "A"
                    ? "bg-green text-white"
                    : "bg-gray-200 hover:bg-green-100"
                }`}
              >
                Left Team
              </button>
              <button
                onClick={() => setFirstServe("B")}
                className={`px-6 py-3 rounded-md ${
                  firstServe === "B"
                    ? "bg-yellow text-black"
                    : "bg-gray-200 hover:bg-yellow-100"
                }`}
              >
                Right Team
              </button>
            </div>
            <div className="flex justify-between mt-6 sm:text-2xl">
              <button
                onClick={() => setStep("players")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!firstServe) return;
                  if (mode === "single") handleStart();
                  else setStep("selectServer");
                }}
                disabled={!firstServe}
                className={`px-6 py-2 rounded-md cursor-pointer ${
                  firstServe
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {mode === "single" ? "Start Match" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Select Doubles Server/Receiver */}
        {step === "selectServer" && mode === "ganda" && (
          <div className="mt-4 text-center">
            <h3 className="text-lg sm:text-3xl font-semibold mb-4">
              Select Server & Receiver (Doubles)
            </h3>
            <p className="mb-2 sm:text-xl font-bold">
              First Server ({firstServe === "A" ? "Left" : "Right"} Team)
            </p>
            {(firstServe === "A"
              ? [formData.teamA1 || "Team A.1", formData.teamA2 || "Team A.2"]
              : [formData.teamB1 || "Team B.1", formData.teamB2 || "Team B.2"]
            ).map((name) => (
              <button
                key={name}
                onClick={() => setFirstServerName(name)}
                className={`block sm:text-xl w-full py-2 rounded-md mb-2 ${
                  firstServerName === name
                    ? "bg-green text-white"
                    : "bg-gray-200 hover:bg-green-100"
                }`}
              >
                {name}
              </button>
            ))}
            <p className="mt-4 sm:text-xl mb-2 font-bold">
              First Receiver ({firstServe === "A" ? "Right" : "Left"} Team)
            </p>
            {(firstServe === "A"
              ? [formData.teamB1 || "Team B.1", formData.teamB2 || "Team B.2"]
              : [formData.teamA1 || "Team A.1", formData.teamA2 || "Team A.2"]
            ).map((name) => (
              <button
                key={name}
                onClick={() => setFirstReceiverName(name)}
                className={`block sm:text-xl w-full py-2 rounded-md mb-2 ${
                  firstReceiverName === name
                    ? "bg-yellow text-black"
                    : "bg-gray-200 hover:bg-yellow-100"
                }`}
              >
                {name}
              </button>
            ))}
            <div className="flex justify-between mt-6 sm:text-2xl">
              <button
                onClick={() => setStep("serve")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleStart}
                disabled={!firstServerName || !firstReceiverName}
                className={`px-6 py-2 rounded-md cursor-pointer ${
                  firstServerName && firstReceiverName
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Start Match
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
