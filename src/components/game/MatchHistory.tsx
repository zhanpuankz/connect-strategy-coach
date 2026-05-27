import { MatchResult, Mode } from "@/lib/game/storage";
import { Trophy, Minus } from "lucide-react";

const modeLabel = (m: Mode) =>
  ({ "local": "Local", "ai-easy": "AI · Easy", "ai-medium": "AI · Medium", "ai-hard": "AI · Hard" })[m];

export function MatchHistory({ matches, onClear }: { matches: MatchResult[]; onClear: () => void }) {
  return (
    <div className="rounded-[24px] glass p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">History</div>
          <h3 className="text-base font-semibold tracking-tight">Recent matches</h3>
        </div>
        {matches.length > 0 && (
          <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear
          </button>
        )}
      </div>
      {!matches.length ? (
        <p className="text-sm text-muted-foreground">No matches yet. Play your first game.</p>
      ) : (
        <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {matches.slice(0, 10).map((m) => {
            const result = m.winner === 0 ? "Draw" : `P${m.winner} wins`;
            const Icon = m.winner === 0 ? Minus : Trophy;
            return (
              <li key={m.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.04] p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-3.5 w-3.5 ${m.winner === 0 ? "text-muted-foreground" : "text-primary"}`} />
                  <div>
                    <div className="font-medium">{result}</div>
                    <div className="text-muted-foreground">{modeLabel(m.mode)} · {m.moves} moves</div>
                  </div>
                </div>
                <div className="text-muted-foreground tabular-nums">
                  {new Date(m.date).toLocaleDateString()}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
