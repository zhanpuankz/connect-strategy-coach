import { useEffect } from "react";
import { Check, Crown, X } from "lucide-react";
import { sfx } from "@/lib/audio";

type Props = {
  open: boolean;
  onClose: () => void;
  feature?: string;
};

export function PremiumModal({ open, onClose, feature }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const items = [
    "Premium board skins",
    "Tournament mode",
    "Multiplayer mode",
    "Extra AI Coach insights",
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-up"
      style={{ background: "oklch(0 0 0 / 0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] gradient-card card-shadow border border-white/[0.06] p-6 sm:p-7 animate-fade-up-slow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { sfx.click(); onClose(); }}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:scale-105 transition-spring"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-4">
          <Crown className="h-5 w-5" />
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.02em]">Unlock Pro</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {feature ? `“${feature}” is a Pro feature.` : "Get everything in Connect Four Arena."}
        </p>

        <div className="mt-5 rounded-2xl glass p-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-semibold tracking-tight">$0.99</span>
            <span className="text-xs text-muted-foreground">/ one-time</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {items.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => { sfx.click(); onClose(); }}
          className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-spring hover:scale-[1.02] glow-shadow"
        >
          Unlock Pro for $0.99
        </button>
        <button
          onClick={() => { sfx.click(); onClose(); }}
          className="mt-2 w-full rounded-full glass py-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-spring"
        >
          Maybe later
        </button>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Demo · no real payment
        </p>
      </div>
    </div>
  );
}
