import { Board, Cell, COLS, ROWS } from "@/lib/game/engine";
import { cn } from "@/lib/utils";

type Props = {
  board: Board;
  onColumnClick: (col: number) => void;
  disabled: boolean;
  current: Cell;
  winCells: Set<string>;
  lastMove: { row: number; col: number } | null;
};

export function BoardView({ board, onColumnClick, disabled, current, winCells, lastMove }: Props) {
  return (
    <div className="relative w-full mx-auto max-w-[min(95vw,560px)]">
      {/* Column hover hint row */}
      <div
        className="grid mb-2"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
      >
        {Array.from({ length: COLS }).map((_, c) => (
          <button
            key={c}
            disabled={disabled || board[0][c] !== 0}
            onClick={() => onColumnClick(c)}
            aria-label={`Drop in column ${c + 1}`}
            className="group flex aspect-square items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div
              className={cn(
                "h-[70%] w-[70%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity disc-shadow",
                current === 1 ? "bg-player-1" : "bg-player-2",
              )}
            />
          </button>
        ))}
      </div>

      {/* Board */}
      <div className="rounded-2xl bg-board p-2 sm:p-3 glow-shadow">
        <div
          className="grid gap-1.5 sm:gap-2"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => {
            const r = Math.floor(i / COLS);
            const c = i % COLS;
            const v = board[r][c];
            const isWin = winCells.has(`${r},${c}`);
            const isLast = lastMove?.row === r && lastMove?.col === c;
            return (
              <button
                key={i}
                onClick={() => onColumnClick(c)}
                disabled={disabled || board[0][c] !== 0}
                className="relative aspect-square rounded-full bg-board-cell overflow-hidden"
              >
                {v !== 0 && (
                  <div
                    className={cn(
                      "absolute inset-[6%] rounded-full disc-shadow",
                      v === 1 ? "bg-player-1" : "bg-player-2",
                      isLast && "animate-drop",
                      isWin && "animate-win ring-2 ring-white/70",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
