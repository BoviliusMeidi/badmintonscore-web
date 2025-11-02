"use client";

import Image from "next/image";
import { JSX } from "react";

/**
 * Props for the HelpModal component.
 */
interface HelpModalProps {
  /** Controls the visibility of the modal. If false, the component returns null. */
  show: boolean;
  /** Callback function triggered when the user clicks the close or "Got it!" button. */
  onClose: () => void;
}

/**
 * @summary
 * A modal component that displays help and usage instructions for the application.
 *
 * @description
 * This component renders a modal overlay explaining the UI elements and features,
 * such as scoring, undo, pause, and history. It also contains an attribution
 * link to the developer's GitHub profile.
 *
 * The modal's visibility is controlled by the `show` prop, and it provides an
 * `onClose` callback for the close buttons.
 *
 * @param {HelpModalProps} props - The destructured props for the component.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {() => void} props.onClose - The function to call to close the modal.
 *
 * @returns {JSX.Element | null} The rendered modal or `null` if `show` is false.
 */
export default function HelpModal({
  show,
  onClose,
}: HelpModalProps): JSX.Element | null {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-main">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-11/12 sm:w-[480px] p-6 sm:p-8 animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          aria-label="Close help modal" // Added aria-label for accessibility
        >
          <Image src="/close.svg" width={26} height={26} alt="Close Button" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <Image src="/help.svg" width={30} height={30} alt="Help Icon" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Help & Guide
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-3 text-gray-700 text-sm sm:text-base leading-relaxed">
          <p className="flex items-start gap-2">
            <Image
              src="/left-right.svg"
              width={24}
              height={24}
              alt="Side Icon"
            />
            <span>
              <strong>L</strong> = Left Side <br /> <strong>R</strong> = Right
              Side
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Image src="/forward.svg" width={24} height={24} alt="Start Icon" />
            <span>
              <strong>New Match:</strong> Enter player names and select the
              first server.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Image
              src="/logo-white.svg"
              width={24}
              height={24}
              alt="Scoring Icon"
            />
            <span>
              <strong>Scoring:</strong> Tap the scoreboard to add points. Player
              positions rotate automatically.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Image src="/undo.svg" width={24} height={24} alt="Undo Icon" />
            <span>
              <strong>Undo:</strong> Revert the last point if you made a
              mistake.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Image src="/pause.svg" width={24} height={24} alt="Pause Icon" />
            <span>
              <strong>Pause:</strong> Pause the match timer anytime.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Image
              src="/history.svg"
              width={24}
              height={24}
              alt="History Icon"
            />
            <span>
              <strong>History:</strong> View previous sets and scores via the
              history button.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Image
              src="/person.svg"
              width={24}
              height={24}
              alt="Developer Icon"
            />
            <span>
              <strong>Built by.</strong>{" "}
              <a
                href="https://github.com/BoviliusMeidi"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @BoviliusMeidi
              </a>{" "}
              😎 on GitHub.
            </span>
          </p>
        </div>

        {/* Footer Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition-all cursor-pointer"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
