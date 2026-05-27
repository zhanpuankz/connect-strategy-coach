import { MatchResult, Mode } from "@/lib/game/storage";
import { Trophy, Minus, X } from "lucide-react";

const modeLabel = (m: Mode) =>
  ({ "local": "Local", "ai-easy": "AI · Easy", "ai-medium": "AI · Medium", "ai-hard": "AI · Hard" })[m];

export function MatchHistory({ matches, onClear }: { matches: MatchResult[]; onClear: () => void }) {
  if (!matches.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No matches yet. Play your first game!
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recent matches</h3>
        <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
          Clear
        </button>
      </div>
      <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {matches.slice(0, 10).map((m) => {
          const result = m.winner === 0 ? "Draw" : `P${m.winner} wins`;
          const Icon = m.winner === 0 ? Minus : Trophy;
          return (
            <li key={m.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${m.winner === 0 ? "text-muted-foreground" : "text-primary"}`} />
                <div>
                  <div className="font-medium">{result}</div>
                  <div className="text-muted-foreground">{modeLabel(m.mode)} · {m.moves} moves</div>
                </div>
              </div>
              <div className="text-muted-foreground">
                {new Date(m.date).toLocaleDateString()}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
