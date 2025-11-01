/**
 * @summary
 * Gets the absolute maximum (cap) score allowed for a given scoring system.
 *
 * @description
 * This utility function enforces the score cap rules based on standard
 * badminton regulations (or common variations):
 * - For a 15-point game, the score is capped at 21 (i.e., if 20-20, the first to 21 wins).
 * - For a 21-point game, the score is capped at 30 (i.e., if 29-29, the first to 30 wins).
 *
 * @param {number} system - The standard target score for the game (e.g., 15, 21, or 30).
 * @returns {number} The absolute maximum score allowed in that game (21 or 30).
 */
export const getMaxPoint = (system: number) => {
  if (system === 15) return 21;
  if (system === 21) return 30;
  return 30; // Default cap (also applies if system is 30)
};
