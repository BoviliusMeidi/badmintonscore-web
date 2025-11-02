"use client";

import { useReducer, useState, useEffect } from "react";
import { GameSnapshot, PointSnapshot, Players } from "@/types/match";
import { getMaxPoint } from "@/utils/getMaxPoint";
import { useTimer } from "@/hooks/useTimer";
import { matchReducer, initialState } from "@/utils/matchReducer";

/**
 * @typedef {object} MatchLogicReturn
 * @description The comprehensive state and API returned by the `useMatchLogic` hook.
 *
 * @property {number} pointsA - Current points for Team A.
 * @property {number} setsA - Current sets for Team A.
 * @property {number} pointsB - Current points for Team B.
 * @property {number} setsB - Current sets for Team B.
 * @property {Players} players - The player rosters.
 * @property {number} time - The current match time in seconds.
 * @property {boolean} isPaused - True if the timer is paused.
 * @property {"A" | "B" | null} serverSide - The side currently serving.
 * @property {string | null} currentServer - The player currently serving.
 * @property {string | null} currentReceiver - The player currently receiving.
 * @property {number} scoringSystem - The target score (e.g., 21).
 * @property {boolean} showMatchHistoryModal - Visibility state for the history modal.
 * @property {boolean} showHelpModal - Visibility state for the help modal.
 * @property {boolean} showSetFinishModal - Visibility state for the set finish modal.
 * @property {GameSnapshot | null} setFinishData - Data for the just-completed set.
 * @property {GameSnapshot[]} historyForModal - The complete match history, including any in-progress game.
 * @property {boolean} isMatchStarted - True if player names have been set.
 *
 * @property {(time: number) => string} formatTime - Function to format seconds to HH:MM:SS.
 * @property {(side: "A" | "B") => void} handleIncrement - Handler to add a point.
 * @property {function} handleStartMatch - Handler to start a new match.
 * @property {() => void} handleUndo - Handler to undo the last point.
 * @property {() => void} handlePause - Handler to pause the timer.
 * @property {() => void} handleResume - Handler to resume the timer.
 * @property {(server: string, receiver: string) => void} continueNextSet - Handler to start the next set.
 * @property {() => void} resetMatchHistory - Handler to clear the match history.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowMatchHistoryModal - Setter for the history modal.
 */

/**
 * @summary
 * A custom hook that acts as the primary state manager for the match.
 *
 * @description
 * This hook combines the `matchReducer` (for core game logic) with `useTimer` (for timekeeping)
 * and local `useState` hooks (for modal visibility). It exposes a single, clean API
 * (state and handlers) for the main `Page` component to consume.
 *
 * @returns {MatchLogicReturn} An object containing all necessary state and handlers for the match UI.
 */
export function useMatchLogic() {
  // --- Core Match State (Managed by Reducer) ---
  const [state, dispatch] = useReducer(matchReducer, initialState);

  // --- Timer State (Local) ---
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { time, setTime, formatTime } = useTimer(isRunning, isPaused);

  // --- Modal UI State (Local) ---
  const [showMatchHistoryModal, setShowMatchHistoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSetFinishModal, setShowSetFinishModal] = useState(false);

  const setCurrentServer = (serverName: string) => {
    dispatch({ type: "SET_NEXT_SERVER", payload: serverName });
  };
  const setCurrentReceiver = (receiverName: string) => {
    dispatch({ type: "SET_NEXT_RECEIVER", payload: receiverName });
  };

  /**
   * @summary Side effect to automatically open the SetFinishModal.
   * @description This effect listens for changes to `state.setFinishData`.
   * When the reducer populates this data (signaling a set has ended),
   * this effect calls `setShowSetFinishModal(true)` to display the modal.
   * The `Promise.resolve()` ensures `setState` runs in the next tick,
   * avoiding synchronous `setState` warnings within an effect.
   */
  useEffect(() => {
    if (state.setFinishData) {
      Promise.resolve().then(() => setShowSetFinishModal(true));
    }
  }, [state.setFinishData]);

  // --- Handlers (Wrappers for dispatch) ---

  /**
   * Dispatches an 'INCREMENT' action to the reducer.
   * @param {"A" | "B"} side - The side that won the point.
   */
  const handleIncrement = (side: "A" | "B") => {
    dispatch({
      type: "INCREMENT",
      payload: {
        side,
        maxPoint: getMaxPoint(state.scoringSystem),
        time,
      },
    });
  };

  /**
   * Dispatches a 'START_MATCH' action to the reducer and resets/starts the timer.
   * @param {Players} newPlayers - The player configuration.
   * @param {"A" | "B"} firstServe - The side serving first.
   * @param {string} firstServerName - The specific player serving first.
   * @param {string} opponentReceiverName - The specific player receiving first.
   * @param {number} [scoringSystemParam] - The optional preset scoring system.
   */
  const handleStartMatch = (
    newPlayers: Players,
    firstServe: "A" | "B",
    firstServerName: string,
    opponentReceiverName: string,
    scoringSystemParam?: number
  ) => {
    dispatch({
      type: "START_MATCH",
      payload: {
        newPlayers,
        firstServe,
        firstServerName,
        opponentReceiverName,
        scoringSystemParam,
        startTime: 0,
      },
    });
    // Reset timer & run
    setTime(0);
    setIsRunning(true);
    setIsPaused(false);
  };

  /** Dispatches an 'UNDO' action to revert the last point. */
  const handleUndo = () => dispatch({ type: "UNDO" });

  /** Pauses the match timer. */
  const handlePause = () => setIsPaused(true);

  /** Resumes the match timer. */
  const handleResume = () => setIsPaused(false);

  /**
   * Dispatches a 'CONTINUE_NEXT_SET' action to the reducer and closes the modal.
   * @param {string} nextServerName - The server selected in the modal.
   * @param {string} nextReceiverName - The receiver selected in the modal.
   */
  const continueNextSet = () => {
    if (!state.setFinishData) return;

    const winnerTeam =
      state.setFinishData.winnerSide === "A"
        ? state.players.teamA
        : state.players.teamB;
    const loserTeam =
      state.setFinishData.winnerSide === "A"
        ? state.players.teamB
        : state.players.teamA;

    const nextServerName = state.currentServer || winnerTeam[0];
    const nextReceiverName = state.currentReceiver || loserTeam[0];

    dispatch({
      type: "CONTINUE_NEXT_SET",
      payload: {
        startTime: time,
        nextServerName,
        nextReceiverName,
      },
    });
    setShowSetFinishModal(false);
  };

  /** Dispatches a 'RESET_HISTORY' action and closes the history modal. */
  const resetMatchHistory = () => {
    dispatch({ type: "RESET_HISTORY" });
    setShowMatchHistoryModal(false);
  };

  // --- Derived State (Calculated on each render) ---

  /** Boolean flag indicating if a match is active. */
  const isMatchStarted = state.players.teamA.length > 0;

  /** A snapshot of the *very* latest state, used for the 'in-progress' game. */
  const currentPointSnapshot: PointSnapshot = {
    pointsA: state.pointsA,
    setsA: state.setsA,
    pointsB: state.pointsB,
    setsB: state.setsB,
    serverSide: state.serverSide,
    currentServer: state.currentServer,
    currentReceiver: state.currentReceiver,
    nextServer: state.nextServer,
    serveIndex: state.serveIndex,
    players: {
      teamA: [...state.players.teamA],
      teamB: [...state.players.teamB],
    },
  };

  /** The current set's history *plus* the latest snapshot. */
  const completePointHistory = [
    ...state.currentSetPointHistory,
    currentPointSnapshot,
  ];

  /** A 'GameSnapshot' object representing the game currently being played. */
  const inProgressGame: GameSnapshot | null =
    isMatchStarted && state.currentSetPointHistory.length > 0
      ? {
          gameNumber: state.matchHistory.length + 1,
          pointsA: state.pointsA,
          pointsB: state.pointsB,
          winnerSide: null,
          duration: time - state.currentSetStartTime,
          pointHistory: completePointHistory,
        }
      : null;

  /** The final array of all finished games *plus* the in-progress game, ready for the modal. */
  const historyForModal = inProgressGame
    ? [...state.matchHistory, inProgressGame]
    : state.matchHistory;

  /**
   * @summary Exposes the complete state and handlers for the Page component.
   * @description Note: State properties are returned individually (e.g., `pointsA: state.pointsA`)
   * instead of spreading (`...state`) to ensure object references (like `players`
   * and `setFinishData`) remain stable between renders, preventing
   * unnecessary `useEffect` triggers in child components.
   */
  return {
    // Individual state properties from reducer
    pointsA: state.pointsA,
    setsA: state.setsA,
    pointsB: state.pointsB,
    setsB: state.setsB,
    players: state.players,
    serverSide: state.serverSide,
    currentServer: state.currentServer,
    currentReceiver: state.currentReceiver,
    scoringSystem: state.scoringSystem,
    setFinishData: state.setFinishData,
    matchHistory: state.matchHistory,

    // Local & Timer state
    time,
    isPaused,
    showMatchHistoryModal,
    showHelpModal,
    showSetFinishModal,
    historyForModal,
    isMatchStarted,

    // Handlers
    formatTime,
    handleIncrement,
    handleStartMatch,
    handleUndo,
    handlePause,
    handleResume,
    continueNextSet,
    resetMatchHistory,

    // Setters (for Modals)
    setShowMatchHistoryModal,
    setShowHelpModal,
    setCurrentServer,
    setCurrentReceiver,
  };
}
