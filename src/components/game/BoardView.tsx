import { useState } from "react";
import { Board, Cell, COLS, ROWS, getDropRow } from "@/lib/game/engine";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/audio";

type Props = {
  board: Board;
  onColumnClick: (col: number) => void;
  disabled: boolean;
  current: Cell;
  winCells: Set<string>;
  lastMove: { row: number; col: number } | null;
  impactKey: number;
};

export function BoardView({
  board, onColumnClick, disabled, current, winCells, lastMove, impactKey,
}: Props) {
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const handleEnter = (c: number) => {
    if (disabled || board[0][c] !== 0) return;
    if (hoverCol !== c) {
      setHoverCol(c);
      sfx.hover();
    }
  };
  const handleClick = (c: number) => {
    if (disabled || board[0][c] !== 0) return;
    onColumnClick(c);
  };

  return (
    <div className="relative w-full mx-auto max-w-[min(96vw,640px)]">

      {/* Floating frame — matte black aluminum */}
      <div className="relative rounded-[32px] gradient-frame frame-shadow matte p-3 sm:p-4">
        {/* Ambient red underglow */}
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[48px] bg-[radial-gradient(ellipse_at_50%_60%,oklch(0.66_0.22_22/0.18),transparent_60%)] animate-ambient" />

        {/* Inner board face — recessed graphite */}
        <div className="relative rounded-[24px] gradient-board p-2.5 sm:p-3 overflow-hidden"
             style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.06), inset 0 -1px 0 oklch(0 0 0 / 0.6), inset 0 12px 30px oklch(0 0 0 / 0.5)" }}>
          {/* Soft reflection sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] bg-[linear-gradient(180deg,oklch(1_0_0/0.05),transparent)]" />

          <div
            className="relative grid gap-1.5 sm:gap-2"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
            onMouseLeave={() => setHoverCol(null)}
          >
            {Array.from({ length: ROWS * COLS }).map((_, i) => {
              const r = Math.floor(i / COLS);
              const c = i % COLS;
              const v = board[r][c];
              const isWin = winCells.has(`${r},${c}`);
              const isLast = lastMove?.row === r && lastMove?.col === c;
              const hoverRow = hoverCol === c ? getDropRow(board, c) : -1;
              const showPreview = !v && hoverRow === r && !disabled;

              return (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => handleEnter(c)}
                  onFocus={() => handleEnter(c)}
                  onClick={() => handleClick(c)}
                  disabled={disabled || board[0][c] !== 0}
                  aria-label={`Column ${c + 1}`}
                  className="relative aspect-square rounded-full bg-board-cell cell-shadow overflow-visible focus:outline-none disabled:cursor-not-allowed group"
                >
                  {/* Recessed hole inner rim */}
                  <span className="pointer-events-none absolute inset-0 rounded-full"
                        style={{ boxShadow: "inset 0 2px 4px oklch(0 0 0 / 0.9), inset 0 -1px 1px oklch(1 0 0 / 0.05)" }} />

                  {/* Hover preview disc */}
                  {showPreview && (
                    <span
                      className={cn(
                        "absolute inset-[8%] rounded-full animate-hover-bob",
                        current === 1 ? "bg-player-1" : "bg-player-2",
                      )}
                      style={{ filter: "blur(0.5px)" }}
                    />
                  )}

                  {/* Placed disc */}
                  {v !== 0 && (
                    <span
                      className={cn(
                        "absolute inset-[7%] rounded-full disc-shadow",
                        v === 1 ? "bg-player-1" : "bg-player-2",
                        isLast && "animate-drop",
                        isWin && "animate-win",
                      )}
                    >
                      {/* Specular highlight */}
                      <span className="absolute left-[18%] top-[14%] h-[28%] w-[28%] rounded-full bg-[radial-gradient(circle,oklch(1_0_0/0.55),transparent_70%)]" />
                    </span>
                  )}

                  {/* Win-cell burst */}
                  {isWin && (
                    <span
                      key={impactKey}
                      className="pointer-events-none absolute inset-[-15%] rounded-full animate-burst"
                      style={{ background: "radial-gradient(circle, oklch(1 0 0 / 0.55), transparent 65%)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand etch */}
        <div className="mt-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          <span>Arena</span>
          <span>7 × 6</span>
        </div>
      </div>
    </div>
  );
}
