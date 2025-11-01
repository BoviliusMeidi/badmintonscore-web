"use client";
/**
 * This component represents the initial homepage screen.
 * It displays a title ("Mulai Pertandingan") and a button to start a new match.
 */
import ScoreChoiceButton from "@/components/ScoreChoice"; // adjust path if needed
import Image from "next/image";

interface StartMatchSectionProps {
  /**
   * Callback function triggered when the user clicks "Start Match".
   */
  onStartMatch: (
    players: { teamA: string[]; teamB: string[] },
    firstServe: "A" | "B",
    firstServerName: string,
    opponentServerName: string,
    scoringSystemParam?: number
  ) => void;
}

export default function StartMatchSection({
  onStartMatch,
}: StartMatchSectionProps) {
  return (
    <div className="flex flex-col items-center justify-end md:justify-center h-screen gap-8 w-full">
      <div className="h-1/3 md:h-1/2"></div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full h-full md:h-3/4 pb-4 px-2 md:px-16 md:pb-16">
        <div className="flex flex-col items-end md:items-start gap-2 mt-8 md:mt-0 md:gap-4 font-secondary text-white md:w-1/3">
          <div className="flex flex-row items-center gap-3">
            <Image
              src={"shuttlecock.svg"}
              width={50}
              height={50}
              alt="shuttlecoc"
              className="hidden md:block"
            />
            <p className="text-2xl md:text-4xl">Point System</p>
            <Image
              src={"shuttlecock.svg"}
              width={50}
              height={50}
              alt="shuttlecoc"
              className="block md:hidden"
            />
          </div>
          <h2 className="text-4xl md:text-8xl font-secondary text-right md:text-left">
            WINNING
            <br />
            SCORE
          </h2>
          <p className="text-base md:text-xl">
            Set the winning score for each set: 15, 21, or 30 points.
          </p>
        </div>
        <div className="font-main flex-row justify-between gap-4 w-full md:gap-12 md:w-2/3 h-full flex ">
          {[15, 21, 30].map((num) => (
            <ScoreChoiceButton
              key={num}
              onStartMatch={onStartMatch}
              presetScoring={num}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
