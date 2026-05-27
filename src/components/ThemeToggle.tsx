import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted, sfx } from "@/lib/audio";

export function ThemeToggle() {
  const [muted, setM] = useState(false);

  useEffect(() => {
    // Force premium dark theme — the canonical experience.
    document.documentElement.classList.remove("light");
    setM(isMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setM(next);
    if (!next) sfx.click();
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-foreground transition-spring hover:scale-105"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
