import { forwardRef } from "react";
import { CoachInsight } from "@/lib/game/coach";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SenseiIcon } from "./SenseiIcon";

type Props = {
  insights: CoachInsight[];
  glow?: boolean;
  asSheet?: boolean;          // mobile bottom-sheet variant
  onDismiss?: () => void;
};

export const CoachPanel = forwardRef<HTMLDivElement, Props>(
  ({ insights, glow, asSheet, onDismiss }, ref) => {
    if (!insights.length) return null;

    const body = (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[24px] gradient-card card-shadow p-5 sm:p-6 overflow-hidden",
          asSheet ? "animate-sheet-up rounded-b-none" : "animate-fade-up-slow",
          glow && "animate-coach-glow",
        )}
      >
        {/* Ambient red wash */}
        <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.66_0.22_22/0.28),transparent_70%)]" />

        {asSheet && (
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/15" />
        )}

        <div className="relative flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <SenseiIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Post-game</div>
            <h3 className="text-lg font-semibold tracking-tight">AI Coach · Sensei</h3>
          </div>
          {asSheet && onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Close coach"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full glass transition-spring hover:scale-105"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {insights.map((i, idx) => {
            const Icon = i.tone === "positive" ? CheckCircle2 : i.tone === "warning" ? AlertTriangle : Info;
            return (
              <div
                key={idx}
                className="rounded-2xl glass p-3.5 animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 mt-0.5",
                      i.tone === "positive" && "text-emerald-400",
                      i.tone === "warning" && "text-amber-400",
                      i.tone === "info" && "text-primary",
                    )}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{i.title}</div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{i.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    if (!asSheet) return body;

    return (
      <div className="fixed inset-x-0 bottom-0 z-[70] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {body}
      </div>
    );
  },
);
CoachPanel.displayName = "CoachPanel";
