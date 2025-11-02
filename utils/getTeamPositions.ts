/**
 * @typedef {object} TeamPositions
 * @description Defines the on-court positions for both teams.
 * @property {[string, string]} teamA - Tuple representing Team A's [Left Player, Right Player].
 * @property {[string, string]} teamB - Tuple representing Team B's [Right Player, Left Player].
 */
interface TeamPositions {
  teamA: [string, string]; // [left, right]
  teamB: [string, string]; // [right, left]
}

/**
 * @typedef {object} GetTeamPositionsParams
 * @description Parameters for the getTeamPositions function.
 */
interface GetTeamPositionsParams {
  /** The team that is currently serving. */
  servingSide: "A" | "B";
  /** The player rosters for both teams. */
  team: { teamA: string[]; teamB: string[] };
  /** The name of the player currently serving. */
  serverName: string;
  /** The name of the player currently receiving. */
  receiverName: string;
  /** Current points for Team A. */
  pointsA: number;
  /** Current points for Team B. */
  pointsB: number;
}

/**
 * @summary
 * Sets the left-right player positions based on initial conditions or the current score.
 *
 * @description
 * - At 0-0: determines initial positions based on the selected server & receiver.
 * - As points increase: the *serving team's* positions change according to even/odd score rules.
 *
 * @remarks
 * This function assumes the receiving team's positions do not change during the rally
 * (it returns their original array order from the `team` prop).
 *
 * @param {GetTeamPositionsParams} props - The destructured parameters object.
 * @param {"A" | "B"} props.servingSide - The team that is currently serving.
 * @param {object} props.team - The player rosters for both teams.
 * @param {string} props.serverName - The name of the player currently serving.
 * @param {string} props.receiverName - The name of the player currently receiving.
 * @param {number} props.pointsA - Current points for Team A.
 * @param {number} props.pointsB - Current points for Team B.
 * @returns {TeamPositions} An object containing the `[Left, Right]` (for A) and `[Right, Left]` (for B) player positions.
 */
export function getTeamPositions({
  servingSide,
  team,
  serverName,
  receiverName,
  pointsA,
  pointsB,
}: GetTeamPositionsParams): TeamPositions {
  const { teamA, teamB } = team;

  // --- Check for singles ---
  const isSingle = teamA.length === 1 && teamB.length === 1;
  if (isSingle) {
    // Single: positions do not change (no rotation)
    return {
      teamA: [teamA[0], teamA[0]], // only 1 player
      teamB: [teamB[0], teamB[0]],
    };
  }

  // --- Doubles: determine initial server & receiver ---
  const servingSiderTeam = servingSide === "A" ? teamA : teamB;
  const opponentTeam = servingSide === "A" ? teamB : teamA;
  const sIdx = Math.max(0, servingSiderTeam.indexOf(serverName));
  const oIdx = Math.max(0, opponentTeam.indexOf(receiverName));

  const server = servingSiderTeam[sIdx];
  const partnerServer = servingSiderTeam[1 - sIdx];
  const receiver = opponentTeam[oIdx];
  const partnerReceiver = opponentTeam[1 - oIdx];

  const isEvenA = pointsA % 2 === 0;
  const isEvenB = pointsB % 2 === 0;

  // --- Initial positions at start of match (0-0) ---
  let teamA_pos: [string, string];
  let teamB_pos: [string, string];

  if (pointsA === 0 && pointsB === 0) {
    if (servingSide === "A") {
      teamA_pos = [partnerServer, server]; // left, right
      teamB_pos = [receiver, partnerReceiver]; // right, left
    } else {
      teamA_pos = [partnerReceiver, receiver]; // left, right
      teamB_pos = [server, partnerServer]; // right, left
    }
  } else {
    // --- Positions during the rally ---
    if (servingSide === "A" && isEvenA) {
      teamA_pos = [partnerServer, server]; // left, right
      teamB_pos = [teamB[0], teamB[1]]; // right, left
    } else if (servingSide === "A" && !isEvenA) {
      teamA_pos = [server, partnerServer]; // left, right
      teamB_pos = [teamB[0], teamB[1]]; // right, left
    } else if (servingSide === "B" && isEvenB) {
      teamA_pos = [teamA[0], teamA[1]]; // left, right
      teamB_pos = [server, partnerServer]; // right, left
    } else if (servingSide === "B" && !isEvenB) {
      teamA_pos = [teamA[0], teamA[1]]; // left, right
      teamB_pos = [partnerServer, server]; // right, left
    } else {
      teamA_pos = [teamA[0], teamA[1]];
      teamB_pos = [teamB[0], teamB[1]];
    }
  }

  return { teamA: teamA_pos, teamB: teamB_pos };
}