import { forwardRef } from "react";
import { CoachInsight } from "@/lib/game/coach";
import { CheckCircle2, AlertTriangle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { insights: CoachInsight[]; glow?: boolean };

export const CoachPanel = forwardRef<HTMLDivElement, Props>(({ insights, glow }, ref) => {
  if (!insights.length) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-[24px] gradient-card card-shadow p-5 sm:p-6 overflow-hidden animate-fade-up-slow",
        glow && "animate-coach-glow",
      )}
    >
      {/* Ambient red wash */}
      <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.66_0.22_22/0.28),transparent_70%)]" />

      <div className="relative flex items-center gap-2.5 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Post-game</div>
          <h3 className="text-lg font-semibold tracking-tight">AI Coach</h3>
        </div>
      </div>

      <div className="relative space-y-2.5">
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
});
CoachPanel.displayName = "CoachPanel";
