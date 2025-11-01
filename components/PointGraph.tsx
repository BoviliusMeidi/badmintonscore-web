"use client";

/**
 * @typedef {object} PointSnapshot
 * @description Represents a complete snapshot of the match state at a single point in time.
 * @remarks
 * This type MUST be kept in sync with the `PointSnapshot` type defined in `Page.tsx`
 * to ensure correct data-passing and graph rendering.
 *
 * @property {number} pointsA - Current points for Team A.
 * @property {number} setsA - Current sets won by Team A.
 * @property {number} pointsB - Current points for Team B.
 * @property {number} setsB - Current sets won by Team B.
 * @property {"A" | "B" | null} serverSide - The side currently serving.
 * @property {string | null} currentServer - The name of the player currently serving.
 * @property {string | null} currentReceiver - The name of the player currently receiving.
 * @property {string | null} nextServer - The name of the next player in the serve rotation.
 * @property {number} serveIndex - The current index in the serveOrder array.
 */
type PointSnapshot = {
  pointsA: number;
  setsA: number;
  pointsB: number;
  setsB: number;
  serverSide: "A" | "B" | null;
  currentServer: string | null;
  currentReceiver: string | null;
  nextServer: string | null;
  serveIndex: number;
};

/**
 * Props interface for the PointGraph component.
 */
interface PointGraphProps {
  pointHistory: PointSnapshot[];
  players: {
    teamA: string[];
    teamB: string[];
  };
}

/**
 * @summary
 * Renders a simple visual "worm" graph representing the point-by-point flow of a game.
 *
 * @description
 * It displays a series of colored blocks, each representing a point won by a team,
 * along with a legend identifying which color belongs to which team.
 * It calculates the point winners by diffing the `pointHistory` array.
 *
 * @param {PointGraphProps} props - The component props.
 * @returns {JSX.Element | null} A div element containing the point flow graph and legend, or null if history is empty.
 */
export default function PointGraph({ pointHistory, players }: PointGraphProps) {
  if (!pointHistory || pointHistory.length === 0) return null;
  const pointWinners: ("A" | "B")[] = [];

  for (let i = 1; i < pointHistory.length; i++) {
    if (pointHistory[i].pointsA > pointHistory[i - 1].pointsA) {
      pointWinners.push("A");
    } else if (pointHistory[i].pointsB > pointHistory[i - 1].pointsB) {
      pointWinners.push("B");
    }
  }

  const teamAName = players.teamA.join(" & ");
  const teamBName = players.teamB.join(" & ");

  return (
    <div className="w-full">
      <h4 className="font-bold text-lg mb-2">Point Flow</h4>
      <div className="flex flex-wrap gap-1 p-2 border rounded-md">
        {pointWinners.length === 0 ? (
          <p className="text-gray-500">No points played to display graph.</p>
        ) : (
          pointWinners.map((winner, idx) => (
            <div
              key={idx}
              title={`Point ${idx + 1}: ${
                winner === "A" ? teamAName : teamBName
              }`}
              className={`h-4 w-1 grow rounded-sm ${
                winner === "A" ? "bg-green" : "bg-yellow"
              }`}
            />
          ))
        )}
      </div>
      {/* Graph Legend */}
      <div className="flex justify-between text-base mt-1">
        <div>
          <span className="inline-block w-3 h-3 bg-green rounded-full mr-1"></span>
          {teamAName}
        </div>
        <div>
          <span className="inline-block w-3 h-3 bg-yellow rounded-full mr-1"></span>
          {teamBName}
        </div>
      </div>
    </div>
  );
}
