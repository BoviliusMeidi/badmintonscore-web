/**
 * Represents a snapshot of the match state at a single point in time.
 * NOTE: This type must be kept in sync with the 'PointSnapshot' type in Page.tsx.
 */
type PointSnapshot = {
  pointsA: number;
  pointsB: number;
  serverSide: "A" | "B" | null;
  currentServer: string | null;
  currentReceiver: string | null;
  serveIndex: number;
};

/**
 * Represents a completed or in-progress game (set).
 * NOTE: This type must be kept in sync with the 'GameSnapshot' type in Page.tsx.
 */
type GameSnapshot = {
  pointsA: number;
  pointsB: number;
  winnerSide: "A" | "B" | null;
  duration: number;
  pointHistory: PointSnapshot[];
  gameNumber: number;
};

/**
 * Defines the structure for calculated statistics for a single game.
 */
export type GameStats = {
  totalPointsWonA: number;
  totalPointsWonB: number;
  totalPointsPlayed: number;
  mostConsecutivePointsA: number;
  mostConsecutivePointsB: number;
  gamePointsA: number;
  gamePointsB: number;
};

/**
 * Defines the structure for aggregated statistics for an entire match.
 * (Structurally identical to GameStats, but represents the whole match).
 */
export type MatchStats = {
  totalPointsWonA: number;
  totalPointsWonB: number;
  totalPointsPlayed: number;
  mostConsecutivePointsA: number;
  mostConsecutivePointsB: number;
  gamePointsA: number;
  gamePointsB: number;
};

/**
 * Analyzes the point-by-point history of a single game to calculate detailed statistics.
 *
 * @param {GameSnapshot} game - The game snapshot, including its full pointHistory.
 * @param {number} scoringSystem - The target score (e.g., 21) needed to correctly identify 'game point' situations.
 * @returns {GameStats} An object containing the calculated statistics for the game.
 */
export const calculateGameStats = (
  game: GameSnapshot,
  scoringSystem: number
): GameStats => {
  const stats: GameStats = {
    totalPointsWonA: game.pointsA,
    totalPointsWonB: game.pointsB,
    totalPointsPlayed: game.pointHistory.length,
    mostConsecutivePointsA: 0,
    mostConsecutivePointsB: 0,
    gamePointsA: 0,
    gamePointsB: 0,
  };

  let currentStreakA = 0;
  let currentStreakB = 0;

  // Start loop from 1, because index 0 is the initial [0, 0] state
  for (let i = 1; i < game.pointHistory.length; i++) {
    const prev = game.pointHistory[i - 1];
    const curr = game.pointHistory[i];

    // Check for consecutive point streaks
    if (curr.pointsA > prev.pointsA) {
      // Team A scored
      currentStreakA++;
      currentStreakB = 0;
      if (currentStreakA > stats.mostConsecutivePointsA) {
        stats.mostConsecutivePointsA = currentStreakA;
      }
    } else if (curr.pointsB > prev.pointsB) {
      // Team B scored
      currentStreakB++;
      currentStreakA = 0;
      if (currentStreakB > stats.mostConsecutivePointsB) {
        stats.mostConsecutivePointsB = currentStreakB;
      }
    }

    // Check for Game Point opportunities
    const gamePointThreshold = scoringSystem - 1; // e.g., 20 in a 21-point game
    const deuceThreshold = scoringSystem; // e.g., 21

    // 1. Standard game point (e.g., 20-18)
    if (
      curr.pointsA === gamePointThreshold &&
      curr.pointsB < gamePointThreshold
    ) {
      stats.gamePointsA++;
    }
    if (
      curr.pointsB === gamePointThreshold &&
      curr.pointsA < gamePointThreshold
    ) {
      stats.gamePointsB++;
    }
    // 2. Deuce/Advantage game point (e.g., 21-20, 22-21, etc.)
    if (curr.pointsA >= deuceThreshold && curr.pointsA === curr.pointsB + 1) {
      stats.gamePointsA++;
    }
    if (curr.pointsB >= deuceThreshold && curr.pointsB === curr.pointsA + 1) {
      stats.gamePointsB++;
    }
  }

  return stats;
};

/**
 * Aggregates statistics from all games in a match into a single MatchStats object.
 *
 * @param {GameSnapshot[]} matchHistory - An array of all game snapshots for the match.
 * @param {number} scoringSystem - The target score, passed down to calculateGameStats.
 * @returns {MatchStats} An object containing the combined statistics for the entire match.
 */
export const calculateMatchStats = (
  matchHistory: GameSnapshot[],
  scoringSystem: number
): MatchStats => {
  // 1. Calculate stats for each game individually
  const allGameStats = matchHistory.map((game) =>
    calculateGameStats(game, scoringSystem)
  );

  // 2. Aggregate all game stats into one MatchStats object
  return allGameStats.reduce(
    (acc, stats) => {
      // Sum totals
      acc.totalPointsWonA += stats.totalPointsWonA;
      acc.totalPointsWonB += stats.totalPointsWonB;
      acc.totalPointsPlayed += stats.totalPointsPlayed;
      acc.gamePointsA += stats.gamePointsA;
      acc.gamePointsB += stats.gamePointsB;

      // Find the maximum streak (not the sum)
      if (stats.mostConsecutivePointsA > acc.mostConsecutivePointsA) {
        acc.mostConsecutivePointsA = stats.mostConsecutivePointsA;
      }
      if (stats.mostConsecutivePointsB > acc.mostConsecutivePointsB) {
        acc.mostConsecutivePointsB = stats.mostConsecutivePointsB;
      }
      return acc;
    },
    // Initial accumulator
    {
      totalPointsWonA: 0,
      totalPointsWonB: 0,
      totalPointsPlayed: 0,
      mostConsecutivePointsA: 0,
      mostConsecutivePointsB: 0,
      gamePointsA: 0,
      gamePointsB: 0,
    }
  );
};
