import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BoardView } from "./BoardView";
import { CoachPanel } from "./CoachPanel";
import { MatchHistory } from "./MatchHistory";
import { Board, Cell, checkWin, createBoard, drop, isBoardFull } from "@/lib/game/engine";
import { Difficulty, chooseMove } from "@/lib/game/ai";
import { CoachInsight, MoveRecord, analyzeGame } from "@/lib/game/coach";
import {
  MatchResult, Mode, Score,
  clearHistory, loadHistory, loadScore, resetScore, saveMatch, saveScore,
} from "@/lib/game/storage";
import { RotateCcw, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/audio";

const modeToDiff = (m: Mode): Difficulty | null =>
  m === "ai-easy" ? "easy" : m === "ai-medium" ? "medium" : m === "ai-hard" ? "hard" : null;

export function GameArena() {
  const [mode, setMode] = useState<Mode>("ai-medium");
  const [board, setBoard] = useState<Board>(createBoard());
  const [current, setCurrent] = useState<Cell>(1);
  const [winInfo, setWinInfo] = useState<{ player: Cell; cells: [number, number][] } | null>(null);
  const [draw, setDraw] = useState(false);
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [insights, setInsights] = useState<CoachInsight[]>([]);
  const [score, setScore] = useState<Score>({ p1: 0, p2: 0, draws: 0 });
  const [history, setHistory] = useState<MatchResult[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [flash, setFlash] = useState(0);
  const [coachGlow, setCoachGlow] = useState(false);
  const [impactKey, setImpactKey] = useState(0);
  const startTime = useRef<number>(Date.now());
  const coachRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScore(loadScore());
    setHistory(loadHistory());
  }, []);

  const reset = useCallback(() => {
    setBoard(createBoard());
    setCurrent(1);
    setWinInfo(null);
    setDraw(false);
    setLastMove(null);
    setMoves([]);
    setInsights([]);
    setCoachGlow(false);
    startTime.current = Date.now();
  }, []);

  const finishGame = useCallback((winner: Cell | 0, finalMoves: MoveRecord[]) => {
    const humanPlayer: Cell = 1;
    const newInsights = analyzeGame(finalMoves, winner, humanPlayer);
    setInsights(newInsights);

    // Outcome sound
    if (winner === humanPlayer) sfx.victory();
    else if (winner === 0) sfx.draw();
    else sfx.defeat();

    // Cinematic coach reveal after a brief pause
    window.setTimeout(() => {
      sfx.whoosh();
      setCoachGlow(true);
      coachRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => setCoachGlow(false), 7000);
    }, 650);

    const ns = { ...score };
    if (winner === 1) ns.p1++;
    else if (winner === 2) ns.p2++;
    else ns.draws++;
    setScore(ns);
    saveScore(ns);
    const rec: MatchResult = {
      id: crypto.randomUUID(),
      date: Date.now(),
      mode,
      winner,
      moves: finalMoves.length,
      duration: Date.now() - startTime.current,
    };
    saveMatch(rec);
    setHistory(loadHistory());
  }, [mode, score]);

  const playMove = useCallback((col: number, player: Cell) => {
    setBoard((prev) => {
      const res = drop(prev, col, player);
      if (!res) return prev;
      sfx.drop();
      const newMoves = [...moves, { col, row: res.row, player }];
      setMoves(newMoves);
      setLastMove({ row: res.row, col });
      const win = checkWin(res.board);
      if (win) {
        setWinInfo(win);
        setImpactKey((k) => k + 1);
        // Win impact: flash + thump shortly after disc lands
        window.setTimeout(() => { sfx.impact(); setFlash((f) => f + 1); }, 380);
        window.setTimeout(() => finishGame(win.player, newMoves), 500);
      } else if (isBoardFull(res.board)) {
        setDraw(true);
        window.setTimeout(() => finishGame(0, newMoves), 300);
      } else {
        setCurrent(player === 1 ? 2 : 1);
      }
      return res.board;
    });
  }, [moves, finishGame]);

  const gameOver = !!winInfo || draw;
  const diff = modeToDiff(mode);
  const aiTurn = diff && current === 2 && !gameOver;

  useEffect(() => {
    if (!aiTurn) return;
    setAiThinking(true);
    const t = window.setTimeout(() => {
      const col = chooseMove(board, 2, diff!);
      if (col >= 0) playMove(col, 2);
      setAiThinking(false);
    }, 520);
    return () => window.clearTimeout(t);
  }, [aiTurn, board, diff, playMove]);

  useEffect(() => { reset(); }, [mode, reset]);

  const winCells = useMemo(() => {
    const s = new Set<string>();
    winInfo?.cells.forEach(([r, c]) => s.add(`${r},${c}`));
    return s;
  }, [winInfo]);

  const handleColumnClick = (col: number) => {
    if (gameOver) return;
    if (diff && current === 2) return;
    playMove(col, current);
  };

  const modeBtn = (m: Mode, label: string, icon: React.ReactNode) => (
    <button
      key={m}
      onClick={() => { sfx.click(); setMode(m); }}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-spring",
        mode === m
          ? "bg-primary text-primary-foreground card-shadow"
          : "glass text-foreground/80 hover:text-foreground hover:scale-[1.03]",
      )}
    >
      {icon}
      {label}
    </button>
  );

  const statusText = gameOver
    ? winInfo
      ? winInfo.player === 1 ? "You win" : (diff ? "AI wins" : "Player 2 wins")
      : "Draw"
    : aiThinking
      ? "AI thinking…"
      : diff && current === 2
        ? "AI's turn"
        : diff
          ? "Your turn"
          : `Player ${current}'s turn`;

  return (
    <>
      {/* Screen-flash overlay on win */}
      {flash > 0 && (
        <div
          key={flash}
          className="pointer-events-none fixed inset-0 z-40 animate-screen-flash"
          style={{ background: "radial-gradient(ellipse at center, oklch(1 0 0 / 0.18), transparent 60%)" }}
        />
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
        <div className="space-y-5">
          {/* Mode selector */}
          <div className="flex flex-wrap gap-2">
            {modeBtn("local", "2 Players", <Users className="h-3.5 w-3.5" />)}
            {modeBtn("ai-easy", "AI · Easy", <Bot className="h-3.5 w-3.5" />)}
            {modeBtn("ai-medium", "AI · Medium", <Bot className="h-3.5 w-3.5" />)}
            {modeBtn("ai-hard", "AI · Hard", <Bot className="h-3.5 w-3.5" />)}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between rounded-2xl glass px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-7 w-7 rounded-full disc-shadow transition-spring",
                  (gameOver ? winInfo?.player : current) === 1 ? "bg-player-1" : "bg-player-2",
                  !gameOver && "animate-pulse",
                )}
              />
              <span className="font-medium text-sm tracking-tight">{statusText}</span>
            </div>
            <button
              onClick={() => { sfx.click(); reset(); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-spring hover:scale-[1.04]"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </button>
          </div>

          <BoardView
            board={board}
            onColumnClick={handleColumnClick}
            disabled={gameOver || aiThinking || (!!diff && current === 2)}
            current={current}
            winCells={winCells}
            lastMove={lastMove}
            impactKey={impactKey}
          />

          {/* Scoreboard */}
          <div className="grid grid-cols-3 gap-3">
            <ScoreCard label={diff ? "You" : "Player 1"} value={score.p1} color="bg-player-1" />
            <ScoreCard label="Draws" value={score.draws} muted />
            <ScoreCard label={diff ? "AI" : "Player 2"} value={score.p2} color="bg-player-2" />
          </div>
          <button
            onClick={() => { sfx.click(); resetScore(); setScore({ p1: 0, p2: 0, draws: 0 }); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset score
          </button>
        </div>

        <aside className="space-y-6">
          {insights.length > 0 ? (
            <CoachPanel ref={coachRef} insights={insights} glow={coachGlow} />
          ) : (
            <div ref={coachRef} className="rounded-[24px] glass p-6 text-sm text-muted-foreground">
              <div className="text-[11px] uppercase tracking-[0.18em] mb-2">Post-game</div>
              <div className="font-semibold text-foreground mb-1.5 text-base tracking-tight">AI Coach</div>
              Finish a game and the coach will break down your moves: missed blocks, center control, winning chances, and diagonal threats.
            </div>
          )}
          <MatchHistory
            matches={history}
            onClear={() => { sfx.click(); clearHistory(); setHistory([]); }}
          />
        </aside>
      </div>
    </>
  );
}

function ScoreCard({ label, value, color, muted }: { label: string; value: number; color?: string; muted?: boolean }) {
  return (
    <div className="rounded-2xl glass p-4 text-center">
      <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {color && <span className={cn("h-2 w-2 rounded-full", color)} />}
        {label}
      </div>
      <div className={cn("mt-1.5 text-3xl font-semibold tracking-tight tabular-nums", muted && "text-muted-foreground")}>{value}</div>
    </div>
  );
}
