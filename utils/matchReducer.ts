"use client";

import {
  MatchState,
  MatchAction,
  GameSnapshot,
  PointSnapshot,
} from "@/types/match";
import { getTeamPositions } from "./getTeamPositions";

/**
 * @summary The default, clean state for a new match.
 * @type {MatchState}
 */
export const initialState: MatchState = {
  pointsA: 0,
  setsA: 0,
  pointsB: 0,
  setsB: 0,
  players: { teamA: [], teamB: [] },
  currentSetPointHistory: [],
  serverSide: null,
  currentServer: null,
  currentReceiver: null,
  nextServer: null,
  serveOrder: [],
  serveIndex: 0,
  scoringSystem: 21,
  currentSetStartTime: 0,
  setFinishData: null,
  matchHistory: [],
  receiverOffsetA: 0,
  receiverOffsetB: 0,
  lastTwoPointWinners: [],
};

/**
 * @summary Calculates the correct receiver based on BWF rules (Even-Even, Odd-Odd).
 * @description
 * Determines the receiver by using the serving team's score parity (even/odd)
 * and the pre-calculated baseline offset for the receiving team.
 * - Server: A, Receiver: B. Uses A's score parity + B's offset (`receiverOffsetA`).
 * - Server: B, Receiver: A. Uses B's score parity + A's offset (`receiverOffsetB`).
 * @param {MatchState} state - The current match state (to access players and offsets).
 * @param {"A" | "B"} servingSide - The team that is *about to* serve.
 * @param {number} pointsAVal - The current points for Team A (for the *next* rally).
 * @param {number} pointsBVal - The current points for Team B (for the *next* rally).
 * @returns {string | null} The name of the calculated receiver.
 * @internal
 */

/**
 * @summary Creates a "frozen" snapshot of the current match state.
 * @description This is used to populate the `currentSetPointHistory` for the "Undo" feature.
 * @param {MatchState} state - The *current* state to snapshot.
 * @returns {PointSnapshot} The immutable snapshot object.
 * @internal
 */
function createSnapshot(state: MatchState): PointSnapshot {
  return {
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
}

/**
 * @summary
 * The main reducer function for managing all match logic.
 *
 * @description
 * This pure function takes the previous state and a dispatched action,
 * and returns a new, immutable state. It contains all the
 * rules for scoring, server rotation, and match progression.
 *
 * @param {MatchState} state - The previous state.
 * @param {MatchAction} action - The action being dispatched.
 * @returns {MatchState} The new, updated state.
 */
export function matchReducer(
  state: MatchState,
  action: MatchAction
): MatchState {
  switch (action.type) {
    // --- ACTION: START_MATCH ---
    // Resets the state and configures a new match.
    case "START_MATCH": {
      const {
        newPlayers,
        firstServe,
        firstServerName,
        opponentReceiverName,
        scoringSystemParam,
        startTime,
      } = action.payload;

      let teamPositions = null;

      const { teamA, teamB } = newPlayers;

      const single = teamA.length === 1;
      if (single) {
        teamPositions = newPlayers;
      } else {
        teamPositions = getTeamPositions({
          servingSide: firstServe,
          team: newPlayers,
          serverName: firstServerName,
          receiverName: opponentReceiverName,
          pointsA: 0,
          pointsB: 0,
        });
      }

      let rotation: string[] = [];
      let server: string | null = null;
      let receiver: string | null = null;

      if (single) {
        server = firstServe === "A" ? teamA[0] : teamB[0];
        receiver = firstServe === "A" ? teamB[0] : teamA[0];
        rotation = [server, receiver];
      } else {
        const firstServerTeam = firstServe === "A" ? teamA : teamB;
        const opponentTeam = firstServe === "A" ? teamB : teamA;
        const sIdx = Math.max(0, firstServerTeam.indexOf(firstServerName));
        const oIdx = Math.max(0, opponentTeam.indexOf(opponentReceiverName));

        const a = firstServerTeam[sIdx]; // Initial Server (Even)
        const b = opponentTeam[oIdx]; // Initial Receiver (Even)
        const c = firstServerTeam[1 - sIdx]; // Server Partner (Odd)
        const d = opponentTeam[1 - oIdx]; // Receiver Partner (Odd)

        rotation = [a, d, c, b]; // BWF Doubles Serve Rotation
        server = firstServerName;
        receiver = opponentReceiverName;
      }

      const initIndex = rotation.findIndex((p) => p === firstServerName);
      const startIndex = initIndex >= 0 ? initIndex : 0;

      return {
        ...initialState, // Reset all state to defaults
        players: teamPositions,
        scoringSystem: scoringSystemParam ?? initialState.scoringSystem,
        currentSetStartTime: startTime,
        serveOrder: rotation,
        serveIndex: startIndex,
        nextServer: rotation[(startIndex + 1) % rotation.length],
        serverSide: firstServe,
        currentServer: server,
        currentReceiver: receiver,
      };
    }

    // --- ACTION: INCREMENT ---
    // Handles a point being won by either side.
    case "INCREMENT": {
      const { side, maxPoint, time } = action.payload;

      const currentStateSnapshot = createSnapshot(state);

      const newPointsA = side === "A" ? state.pointsA + 1 : state.pointsA;
      const newPointsB = side === "B" ? state.pointsB + 1 : state.pointsB;

      const isEvenA = newPointsA % 2 === 0;
      const isEvenB = newPointsB % 2 === 0;

      const isSetFinished =
        (newPointsA >= state.scoringSystem && newPointsA - newPointsB >= 2) ||
        (newPointsB >= state.scoringSystem && newPointsB - newPointsA >= 2) ||
        newPointsA === maxPoint ||
        newPointsB === maxPoint;

      // ---- 1. Handle Set Finish ----
      if (isSetFinished) {
        const winnerSide = newPointsA > newPointsB ? "A" : "B";
        const newSetsA = state.setsA + (winnerSide === "A" ? 1 : 0);
        const newSetsB = state.setsB + (winnerSide === "B" ? 1 : 0);

        const finalPointSnapshot: PointSnapshot = {
          ...currentStateSnapshot,
          pointsA: newPointsA,
          pointsB: newPointsB,
          setsA: newSetsA,
          setsB: newSetsB,
        };

        const gameHistory = [
          ...state.currentSetPointHistory,
          currentStateSnapshot, // State *before* the winning point
          finalPointSnapshot, // State *after* the winning point
        ];

        // Calculate last two point winners for next-set server logic
        const winners: ("A" | "B")[] = [];
        for (let i = 1; i < gameHistory.length; i++) {
          const prev = gameHistory[i - 1];
          const cur = gameHistory[i];
          if (cur.pointsA > prev.pointsA) winners.push("A");
          else if (cur.pointsB > prev.pointsB) winners.push("B");
        }

        const lastTwo = winners.slice(-2);

        const data: GameSnapshot = {
          gameNumber: state.matchHistory.length + 1,
          pointsA: newPointsA,
          pointsB: newPointsB,
          duration: time - state.currentSetStartTime,
          winnerSide: winnerSide,
          pointHistory: gameHistory,
        };

        const winnerTeam =
          winnerSide === "A" ? state.players.teamA : state.players.teamB;
        const loserTeam =
          winnerSide === "A" ? state.players.teamB : state.players.teamA;

        let defaultNextServer = winnerTeam[0]; // Default fallback

        // Determine default server based on custom rules
        if (lastTwo.length === 2 && state.serveOrder.length > 0) {
          const sameWinner = lastTwo[0] === lastTwo[1];

          if (sameWinner) {
            // Last two points won by same team: server stays
            defaultNextServer = state.currentServer ?? winnerTeam[0];
          } else {
            // Last two points split: server switches to partner
            const lastServerIndex = state.serveOrder.indexOf(
              state.currentServer!
            );
            if (lastServerIndex !== -1) {
              const partnerIndex =
                (lastServerIndex + 2) % state.serveOrder.length;
              defaultNextServer = state.serveOrder[partnerIndex];
            } else {
              defaultNextServer = winnerTeam[0]; // Fallback
            }
          }
        } else {
          defaultNextServer = state.currentServer ?? winnerTeam[0];
        }

        // Ensure the default server is on the winning team
        if (!winnerTeam.includes(defaultNextServer)) {
          defaultNextServer = winnerTeam[0];
        }

        const isSingle = state.players.teamA.length === 1;
        let teamPositions = null;

        if (isSingle) {
          teamPositions = state.players;
        } else {
          teamPositions = getTeamPositions({
            servingSide: winnerSide,
            team: state.players,
            serverName: defaultNextServer,
            receiverName: state.currentReceiver!,
            pointsA: newPointsA,
            pointsB: newPointsB,
          });
        }

        let defaultNextReceiver = null;
        if (winnerSide === "A") {
          defaultNextReceiver = loserTeam[0];
        } else {
          defaultNextReceiver = loserTeam[1];
        }

        return {
          ...state,
          pointsA: newPointsA,
          pointsB: newPointsB,
          setsA: newSetsA,
          setsB: newSetsB,
          setFinishData: data,
          matchHistory: [...state.matchHistory, data],
          lastTwoPointWinners: lastTwo,

          // Set state to new defaults for the modal
          currentServer: defaultNextServer,
          currentReceiver: defaultNextReceiver,
          players: teamPositions,

          currentSetPointHistory: [], // Clear history for next set
        };
      }

      // ---- 2. Handle Point-in-Progress ----
      const prevServerSide = state.serverSide;
      const isServeChange = side !== prevServerSide;

      let newServerSide = prevServerSide ?? side;
      let newServer = state.currentServer;
      let newNext = state.nextServer;
      let newServeIndex = state.serveIndex;

      // If serve changed, advance the server rotation
      if (isServeChange && state.serveOrder.length > 0) {
        newServeIndex = (state.serveIndex + 1) % state.serveOrder.length;
        newServer = state.serveOrder[newServeIndex];
        newNext =
          state.serveOrder[(newServeIndex + 1) % state.serveOrder.length];
        newServerSide = state.players.teamA.includes(newServer) ? "A" : "B";
      }

      const isSingle = state.players.teamA.length === 1;
      let teamPositions = null;
      let newReceiver = null;

      if (isSingle) {
        teamPositions = state.players;
        if (newServerSide === "A") {
          newReceiver = teamPositions.teamB[0];
        } else if (newServerSide === "B") {
          newReceiver = teamPositions.teamA[0];
        }
      } else {
        teamPositions = getTeamPositions({
          servingSide: side,
          team: state.players,
          serverName: newServer!,
          receiverName: state.currentReceiver!,
          pointsA: newPointsA,
          pointsB: newPointsB,
        });

        if (newServerSide === "A" && isEvenA) {
          newReceiver = teamPositions.teamB[0];
        } else if (newServerSide === "A" && !isEvenA) {
          newReceiver = teamPositions.teamB[1];
        } else if (newServerSide === "B" && isEvenB) {
          newReceiver = teamPositions.teamA[1];
        } else if (newServerSide === "B" && !isEvenB) {
          newReceiver = teamPositions.teamA[0];
        }
      }

      return {
        ...state,
        pointsA: newPointsA,
        pointsB: newPointsB,
        currentSetPointHistory: [
          ...state.currentSetPointHistory,
          currentStateSnapshot,
        ],
        serverSide: newServerSide,
        currentServer: newServer,
        nextServer: newNext,
        serveIndex: newServeIndex,
        currentReceiver: newReceiver,
        players: teamPositions,
      };
    }

    // --- ACTION: UNDO ---
    // Reverts the state to the previous point.
    case "UNDO": {
      if (state.currentSetPointHistory.length === 0) return state;

      const lastState =
        state.currentSetPointHistory[state.currentSetPointHistory.length - 1];

      return {
        ...state,
        ...lastState, // Restore all properties from the snapshot
        currentSetPointHistory: state.currentSetPointHistory.slice(0, -1),
      };
    }

    // --- ACTION: CONTINUE_NEXT_SET ---
    // Resets scores and configures server/receiver/offsets for the new set.
    case "CONTINUE_NEXT_SET": {
      const { startTime, nextServerName, nextReceiverName } = action.payload;
      const { players } = state;

      const isSingle = players.teamA.length === 1;
      let newServeOrder = state.serveOrder;

      if (isSingle) {
        newServeOrder = players.teamA.includes(nextServerName)
          ? [nextServerName, nextReceiverName]
          : [nextServerName, nextReceiverName];
      } else if (players.teamA.length > 1) {
        // Re-calculate rotation and offsets based on modal selection
        const serverTeam = players.teamA.includes(nextServerName)
          ? players.teamA
          : players.teamB;
        const receiverTeam = players.teamA.includes(nextReceiverName)
          ? players.teamA
          : players.teamB;

        const sIdx = Math.max(0, serverTeam.indexOf(nextServerName));
        const oIdx = Math.max(0, receiverTeam.indexOf(nextReceiverName));
        const serverPartner = serverTeam[1 - sIdx];
        const receiverPartner = receiverTeam[1 - oIdx];

        newServeOrder = [
          nextServerName,
          receiverPartner,
          serverPartner,
          nextReceiverName,
        ];
      }

      let teamPositions = null;

      if (isSingle) {
        teamPositions = state.players;
      } else {
        teamPositions = getTeamPositions({
          servingSide: state.serverSide!,
          team: state.players,
          serverName: nextServerName,
          receiverName: nextReceiverName,
          pointsA: 0,
          pointsB: 0,
        });
      }

      return {
        ...state,
        pointsA: 0,
        pointsB: 0,
        currentServer: nextServerName,
        serverSide: players.teamA.includes(nextServerName) ? "A" : "B",
        currentReceiver: nextReceiverName,
        currentSetStartTime: startTime,
        setFinishData: null,
        currentSetPointHistory: [], // Clear history for new set
        lastTwoPointWinners: [],
        serveOrder: newServeOrder,
        serveIndex: 0, // Start new set at index 0
        nextServer: newServeOrder[1] ?? null,
        players: teamPositions,
      };
    }

    // --- OTHER ACTIONS ---
    case "RESET_HISTORY":
      return { ...state, matchHistory: [] };
    case "SET_SET_FINISH_DATA":
      return { ...state, setFinishData: action.payload };
    case "CLEAR_POINT_HISTORY":
      return { ...state, currentSetPointHistory: [] };

    // --- (ADDED) Actions for SetFinishModal dropdowns ---
    /**
     * Updates the 'currentServer' state.
     * Used by the SetFinishModal to update the next server choice.
     */
    case "SET_NEXT_SERVER":
      return { ...state, currentServer: action.payload };
    /**
     * Updates the 'currentReceiver' state.
     * Used by the SetFinishModal to update the next receiver choice.
     */
    case "SET_NEXT_RECEIVER":
      return { ...state, currentReceiver: action.payload };

    default:
      return state;
  }
}
