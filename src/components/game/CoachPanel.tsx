import { CoachInsight } from "@/lib/game/coach";
import { CheckCircle2, AlertTriangle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function CoachPanel({ insights }: { insights: CoachInsight[] }) {
  if (!insights.length) return null;
  return (
    <div className="space-y-3 animate-fade-up">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Coach</h3>
      </div>
      <div className="space-y-2">
        {insights.map((i, idx) => {
          const Icon = i.tone === "positive" ? CheckCircle2 : i.tone === "warning" ? AlertTriangle : Info;
          return (
            <div
              key={idx}
              className={cn(
                "rounded-xl border p-3 gradient-card",
                i.tone === "positive" && "border-emerald-500/40",
                i.tone === "warning" && "border-amber-500/40",
                i.tone === "info" && "border-border",
              )}
            >
              <div className="flex gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 mt-0.5",
                    i.tone === "positive" && "text-emerald-500",
                    i.tone === "warning" && "text-amber-500",
                    i.tone === "info" && "text-primary",
                  )}
                />
                <div>
                  <div className="text-sm font-medium">{i.title}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{i.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
