import Image from "next/image";

interface IconButtonProps {
  icon: string;
  alt: string;
  onAction: () => void;
}

/**
 * IconButton Component
 * ---
 * A reusable circular button displaying an icon.
 */
export default function IconButton({ icon, alt, onAction }: IconButtonProps) {
  return (
    <button
      onClick={onAction}
      className="group bg-white flex justify-center items-center rounded-full md:p-4 mx-1 md:mx-4 w-10 h-10 md:w-16 md:h-16 hover:bg-black transition duration-300"
      aria-label={alt}
    >
      <Image
        src={icon}
        width={25}
        height={25}
        alt={alt}
        className="transition duration-300 group-hover:filter group-hover:invert group-hover:brightness-0 group-hover:saturate-0"
      />
    </button>
  );
}
