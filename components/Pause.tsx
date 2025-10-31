import Image from "next/image";

interface PauseProps {
  handleResume: () => void;
}

export default function Pause({ handleResume }: PauseProps) {
  return (
    <div
      onClick={handleResume}
      className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-primary via-hover to-secondary z-50 opacity-90 cursor-pointer transition-all duration-300"
    >
      <div className="animate-bounce">
        <Image
          src="/logo.svg"
          width={120}
          height={120}
          alt="Badminton"
          className="drop-shadow-icon sm:w-48 sm:h-48 "
        />
      </div>
      <p className="absolute bottom-5 right-5 sm:text-2xl font-main text-black tracking-widest font-semibold drop-shadow-md">
        *Tap anywhere to resume
      </p>
    </div>
  );
}
