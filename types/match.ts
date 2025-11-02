/**
 * @summary Represents a complete snapshot of the match state at a single point in time.
 * @description Used to store the history of each point within a game, enabling features like
 * "Undo" and point-by-point playback/analysis.
 * @remarks This type is crucial for the `pointHistory` array in `GameSnapshot`.
 */
export type PointSnapshot = {
  /** Current points for Team A at this snapshot. */
  pointsA: number;
  /** Current sets won by Team A at this snapshot. */
  setsA: number;
  /** Current points for Team B at this snapshot. */
  pointsB: number;
  /** Current sets won by Team B at this snapshot. */
  setsB: number;
  /** The side currently holding the serve ('A' or 'B'). */
  serverSide: "A" | "B" | null;
  /** The name of the player currently serving. */
  currentServer: string | null;
  /** The name of the player currently receiving. */
  currentReceiver: string | null;
  /** The name of the next player in the serve rotation (for UI display). */
  nextServer: string | null;
  /** The current index in the `serveOrder` array (0-3 for doubles). */
  serveIndex: number;
  /** The name of player. */
  players: { teamA: string[]; teamB: string[] };
};

/**
 * @summary Represents the final results and history of a single game (set).
 * @description A `GameSnapshot` is created at the end of each game and stored
 * in the `matchHistory` array. It can also represent an "in-progress" game
 * for live stats.
 */
export type GameSnapshot = {
  /** The sequential number of the game (e.g., 1, 2, 3). */
  gameNumber: number;
  /** The final (or current) score for Team A in this game. */
  pointsA: number;
  /** The final (or current) score for Team B in this game. */
  pointsB: number;
  /** The winning side. 'null' if the game is in progress. */
  winnerSide: "A" | "B" | null;
  /** The duration of the game in seconds. */
  duration: number;
  /** An array of all point snapshots recorded during this game, including the [0,0] state. */
  pointHistory: PointSnapshot[];
};

/**
 * @summary Defines the structure for the player rosters.
 */
export interface Players {
  /** An array of player names for Team A (left side). */
  teamA: string[];
  /** An array of player names for Team B (right side). */
  teamB: string[];
}

/**
 * @summary Defines the complete state structure for the `matchReducer`.
 * @description This interface holds all persistent data for an active match,
 * including scores, player info, server/receiver state, and history.
 */
export interface MatchState {
  // --- Score & Set State ---
  /** Current points for Team A in the active game. */
  pointsA: number;
  /** Current sets won by Team A in the match. */
  setsA: number;
  /** Current points for Team B in the active game. */
  pointsB: number;
  /** Current sets won by Team B in the match. */
  setsB: number;

  // --- Player & Team State ---
  /** The player rosters. For doubles, this is ordered by [Even, Odd] positions. */
  players: Players;

  // --- History & Snapshot State ---
  /** A history of all points played in the *current* game. Reset every game. */
  currentSetPointHistory: PointSnapshot[];
  /** A history of all *completed* games in the match. */
  matchHistory: GameSnapshot[];

  // --- Server/Receiver State ---
  /** The team side currently holding the serve. */
  serverSide: "A" | "B" | null;
  /** The specific player currently serving. */
  currentServer: string | null;
  /** The specific player currently set to receive. */
  currentReceiver: string | null;
  /** The next player in the serve rotation (for UI). */
  nextServer: string | null;
  /** The BWF standard server rotation order (e.g., [A_Even, B_Odd, A_Odd, B_Even]). */
  serveOrder: string[];
  /** The current index (0-3) of the `serveOrder` array. */
  serveIndex: number;

  // --- Config & Modal State ---
  /** The target score for the game (e.g., 21). */
  scoringSystem: number;
  /** The timestamp (`time`) when the current set started. */
  currentSetStartTime: number;
  /** Holds the data for the just-finished game, to show on the SetFinishModal. */
  setFinishData: GameSnapshot | null;

  // --- Doubles-Specific State ---
  /**
   * The index (0 or 1) of Team B's "Even" (right-side) player.
   * Used to calculate receiver position when Team A is serving.
   */
  receiverOffsetA: number;
  /**
   * The index (0 or 1) of Team A's "Even" (right-side) player.
   * Used to calculate receiver position when Team B is serving.
   */
  receiverOffsetB: number;
  /** Stores the winners ("A" or "B") of the last two points of a game. */
  lastTwoPointWinners: ("A" | "B")[];
}

/**
 * @summary Defines all possible actions that can be dispatched to the `matchReducer`.
 * @description This is a discriminated union type. Each action has a `type` property
 * and an optional `payload` containing the data needed for that action.
 *
 * @property {"START_MATCH"} type - Resets the state and starts a new match with the given configuration.
 * @property {"INCREMENT"} type - Adds a point to a side and calculates the next server/receiver.
 * @property {"CONTINUE_NEXT_SET"} type - Resets scores and sets the server/receiver for the next game.
 * @property {"UNDO"} type - Reverts the match state to the previous `PointSnapshot`.
 * @property {"RESET_HISTORY"} type - Clears the `matchHistory` array.
 * @property {"SET_SET_FINISH_DATA"} type - Manually sets or clears the `setFinishData` object.
 * @property {"CLEAR_POINT_HISTORY"} type - Manually clears the `currentSetPointHistory`.
 * @property {"SET_NEXT_SERVER"} type - Manually sets the `setNextServer`.
 * @property {"SET_NEXT_RECEIVER"} type - Manually sets the `SetNextReceiver`.
 */
export type MatchAction =
  | {
      type: "START_MATCH";
      payload: {
        newPlayers: Players;
        firstServe: "A" | "B";
        firstServerName: string;
        opponentReceiverName: string;
        scoringSystemParam?: number;
        startTime: number;
      };
    }
  | {
      type: "INCREMENT";
      payload: {
        side: "A" | "B";
        maxPoint: number;
        time: number;
      };
    }
  | {
      type: "CONTINUE_NEXT_SET";
      payload: {
        startTime: number;
        nextServerName: string;
        nextReceiverName: string;
      };
    }
  | { type: "UNDO" }
  | { type: "RESET_HISTORY" }
  | { type: "SET_SET_FINISH_DATA"; payload: GameSnapshot | null }
  | { type: "CLEAR_POINT_HISTORY" }
  | { type: "SET_NEXT_SERVER"; payload: string }
  | { type: "SET_NEXT_RECEIVER"; payload: string };
