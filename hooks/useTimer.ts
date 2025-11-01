"use client";

import { useState, useEffect } from "react";

/**
 * @typedef {object} UseTimerReturn
 * @description The return object from the useTimer hook.
 * @property {number} time - The current elapsed time in seconds.
 * @property {Dispatch<SetStateAction<number>>} setTime - The state setter for `time`. This allows the parent component to manually reset or set the timer.
 * @property {(seconds: number) => string} formatTime - A utility function to format the time in seconds into a `HH:MM:SS` string.
 */

/**
 * @summary
 * A custom React hook to manage a simple stopwatch timer.
 *
 * @description
 * This hook encapsulates the logic for a timer that counts up in seconds.
 * It uses `useEffect` to manage a `setInterval` based on the provided
 * `isRunning` and `isPaused` flags. It also returns a utility function
 * to format the elapsed time.
 *
 * @example
 * const { time, setTime, formatTime } = useTimer(isMatchRunning, isMatchPaused);
 *
 * @param {boolean} isRunning - The timer will only run if this is `true`.
 * @param {boolean} isPaused - If `true`, the timer will stop counting even if `isRunning` is `true`.
 *
 * @returns {UseTimerReturn} An object containing the current `time` (in seconds),
 * the `setTime` state setter, and a `formatTime` utility function.
 */
export function useTimer(isRunning: boolean, isPaused: boolean) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // The timer runs only if the process is active AND not paused.
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1); // Increment time by 1 second
      }, 1000);
    }

    // Cleanup function:
    // This runs when the component unmounts or when dependencies change.
    return () => {
      clearInterval(interval);
    };
  }, [isRunning, isPaused]); // Dependencies for the effect

  /**
   * Formats a given number of seconds into a HH:MM:SS string.
   * @param {number} seconds - The total seconds to format.
   * @returns {string} The formatted time string (e.g., "01:23:45").
   * @internal
   */
  const formatTime = (seconds: number): string => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return { time, setTime, formatTime };
}