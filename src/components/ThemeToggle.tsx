import { useEffect, useState } from "react";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted, sfx } from "@/lib/audio";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [muted, setM] = useState(false);

  useEffect(() => {
    const t = getStoredTheme();
    setTheme(t);
    applyTheme(t);
    setM(isMuted());
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    sfx.click();
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setM(next);
    if (!next) sfx.click();
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-foreground transition-spring hover:scale-105"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <button
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-foreground transition-spring hover:scale-105"
      >
        {theme === "dark"
          ? <Sun className="h-4 w-4 transition-transform duration-500" />
          : <Moon className="h-4 w-4 transition-transform duration-500" />}
      </button>
    </div>
  );
}
