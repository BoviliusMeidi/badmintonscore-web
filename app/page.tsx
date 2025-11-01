"use client";

import Navbar from "@/components/NavBar";
import StartMatchSection from "@/components/StartMatch";
import MatchHistoryModal from "@/components/MatchHistoryModal";
import MatchInterface from "@/components/MatchInterface";
import SetFinishModal from "@/components/SetFinishModal";
import { useMatchLogic } from "@/hooks/useMatchLogic";

/**
 * @summary
 * The main application page component (root) for the Badminton Scoreboard.
 *
 * @description
 * This component serves as the primary container and view layer for the application.
 * It is a "dumb" component that outsources all complex state management and
 * business logic to the `useMatchLogic` custom hook.
 *
 * Its sole responsibilities are:
 * 1. Calling `useMatchLogic` to get the current state and all event handlers.
 * 2. Conditionally rendering either the `StartMatchSection` or the main `MatchInterface`.
 * 3. Rendering the (hidden by default) `SetFinishModal` and `MatchHistoryModal`.
 * 4. Passing the correct state and handlers (props) down to these child components.
 *
 * @returns {JSX.Element} The fully composed application UI.
 */
export default function Page() {
  const {
    // State properties
    pointsA,
    setsA,
    pointsB,
    setsB,
    players,
    serverSide,
    currentServer,
    currentReceiver,
    scoringSystem,
    setFinishData,
    time,
    isPaused,
    showMatchHistoryModal,
    showSetFinishModal,
    historyForModal,
    isMatchStarted,

    // Handlers and functions
    formatTime,
    handleIncrement,
    handleStartMatch,
    handleUndo,
    handlePause,
    handleResume,
    continueNextSet,
    resetMatchHistory,
    setShowMatchHistoryModal,

    // Setters for controlled components
    setCurrentServer,
    setCurrentReceiver,
  } = useMatchLogic();

  return (
    <div className="flex flex-col h-screen bg-primary font-sans relative z-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('/background.svg')] before:bg-no-repeat before:bg-cover before:opacity-20 before:z-[-1]">
      {/* --- Navigation Bar --- */}
      <Navbar onStartMatch={handleStartMatch} isMatchStarted={isMatchStarted} />
      <div className="h-20 sm:h-24" />

      {/* --- Main Content Area --- */}
      <div className="flex flex-col items-center flex-1 w-full">
        {!isMatchStarted ? (
          // 1. Show Start Section if match is not active
          <StartMatchSection onStartMatch={handleStartMatch} />
        ) : (
          // 2. Show Match Interface if match is active
          <MatchInterface
            players={players}
            formatTime={formatTime}
            time={time}
            currentServer={currentServer}
            currentReceiver={currentReceiver}
            pointsA={pointsA}
            setsA={setsA}
            pointsB={pointsB}
            setsB={setsB}
            handleIncrement={handleIncrement}
            isPaused={isPaused}
            serverSide={serverSide}
            handleUndo={handleUndo}
            handlePause={handlePause}
            handleStartMatch={handleStartMatch}
            setShowMatchHistoryModal={setShowMatchHistoryModal}
            handleResume={handleResume}
          />
        )}
      </div>

      {/* --- Modals (Rendered conditionally by their internal state) --- */}

      {/* Set Finish Modal: Appears when a set is won */}
      <SetFinishModal
        show={showSetFinishModal}
        gameData={setFinishData}
        players={players}
        scoringSystem={scoringSystem}
        currentServer={currentServer}
        onSetCurrentServer={setCurrentServer}
        currentReceiver={currentReceiver}
        onSetCurrentReceiver={setCurrentReceiver}
        onContinue={continueNextSet}
      />

      {/* Match History Modal: Appears when history icon is clicked */}
      <MatchHistoryModal
        show={showMatchHistoryModal}
        onClose={() => setShowMatchHistoryModal(false)}
        matchHistory={historyForModal}
        players={players}
        scoringSystem={scoringSystem}
        onReset={resetMatchHistory}
      />
    </div>
  );
}