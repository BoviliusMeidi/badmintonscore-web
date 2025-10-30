"use client";

import Image from "next/image";
import { JSX } from "react";

/**
 * Props interface for the IconButton component.
 *
 * @property {string} icon - The path to the icon image (e.g., "/undo.svg").
 * @property {string} alt - Alternative text for accessibility and screen readers.
 * @property {() => void} onAction - Function to be executed when the button is clicked.
 */
interface IconButtonProps {
  icon: string;
  alt: string;
  onAction: () => void;
}

/**
 * IconButton Component
 * ---
 * A reusable, circular button component that displays an icon in the center.
 *
 * Features:
 * - Hover animation that inverts icon color and changes background.
 * - Responsive sizing for both small and medium screens.
 * - Accessible via `aria-label` for screen readers.
 *
 * Usage example:
 * ```tsx
 * <IconButton icon="/pause.svg" alt="Pause" onAction={handlePause} />
 * ```
 *
 * @param {IconButtonProps} props - Component properties.
 * @returns {JSX.Element} A stylized button element containing an icon.
 */
export default function IconButton({
  icon,
  alt,
  onAction,
}: IconButtonProps): JSX.Element {
  return (
    <button
      onClick={onAction}
      aria-label={alt}
      className="group bg-white flex justify-center items-center rounded md:p-4 mx-1 md:mx-4 w-12 h-12 md:w-18 md:h-18 hover:bg-black transition duration-300 cursor-pointer"
    >
      <Image
        src={icon}
        width={25}
        height={25}
        alt={alt}
        className="
          transition duration-300 
          group-hover:filter group-hover:invert 
          group-hover:brightness-0 group-hover:saturate-0
        "
      />
    </button>
  );
}
