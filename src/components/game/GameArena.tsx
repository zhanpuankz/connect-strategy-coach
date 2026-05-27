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
  const startTime = useRef<number>(Date.now());

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
    startTime.current = Date.now();
  }, []);

  const finishGame = useCallback((winner: Cell | 0, finalMoves: MoveRecord[]) => {
    const humanPlayer: Cell = 1;
    setInsights(analyzeGame(finalMoves, winner, humanPlayer));
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
      const newMoves = [...moves, { col, row: res.row, player }];
      setMoves(newMoves);
      setLastMove({ row: res.row, col });
      const win = checkWin(res.board);
      if (win) {
        setWinInfo(win);
        setTimeout(() => finishGame(win.player, newMoves), 200);
      } else if (isBoardFull(res.board)) {
        setDraw(true);
        setTimeout(() => finishGame(0, newMoves), 200);
      } else {
        setCurrent(player === 1 ? 2 : 1);
      }
      return res.board;
    });
  }, [moves, finishGame]);

  const gameOver = !!winInfo || draw;
  const diff = modeToDiff(mode);
  const aiTurn = diff && current === 2 && !gameOver;

  // AI move
  useEffect(() => {
    if (!aiTurn) return;
    setAiThinking(true);
    const t = setTimeout(() => {
      const col = chooseMove(board, 2, diff!);
      if (col >= 0) playMove(col, 2);
      setAiThinking(false);
    }, 450);
    return () => clearTimeout(t);
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
      onClick={() => setMode(m)}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
        mode === m
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-secondary text-secondary-foreground hover:bg-accent",
      )}
    >
      {icon}
      {label}
    </button>
  );

  const statusText = gameOver
    ? winInfo
      ? `Player ${winInfo.player} wins!`
      : "It's a draw"
    : aiThinking
      ? "AI thinking…"
      : diff && current === 2
        ? "AI's turn"
        : `Player ${current}'s turn`;

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8">
      <div className="space-y-4">
        {/* Mode selector */}
        <div className="flex flex-wrap gap-2">
          {modeBtn("local", "2 Players", <Users className="h-3.5 w-3.5" />)}
          {modeBtn("ai-easy", "AI Easy", <Bot className="h-3.5 w-3.5" />)}
          {modeBtn("ai-medium", "AI Medium", <Bot className="h-3.5 w-3.5" />)}
          {modeBtn("ai-hard", "AI Hard", <Bot className="h-3.5 w-3.5" />)}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between rounded-xl border border-border gradient-card px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-6 w-6 rounded-full disc-shadow transition-all",
                (gameOver ? winInfo?.player : current) === 1 ? "bg-player-1" : "bg-player-2",
                !gameOver && "animate-pulse",
              )}
            />
            <span className="font-medium text-sm">{statusText}</span>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:scale-105 glow-shadow"
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
        />

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3">
          <ScoreCard label="Player 1" value={score.p1} color="bg-player-1" />
          <ScoreCard label="Draws" value={score.draws} muted />
          <ScoreCard label={diff ? "AI" : "Player 2"} value={score.p2} color="bg-player-2" />
        </div>
        <button
          onClick={() => { resetScore(); setScore({ p1: 0, p2: 0, draws: 0 }); }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Reset score
        </button>
      </div>

      <aside className="space-y-6">
        {insights.length > 0 ? (
          <CoachPanel insights={insights} />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
            <div className="font-medium text-foreground mb-1">AI Coach</div>
            Finish a game and the coach will break down your moves: missed blocks, center control, winning chances, and diagonal threats.
          </div>
        )}
        <MatchHistory
          matches={history}
          onClear={() => { clearHistory(); setHistory([]); }}
        />
      </aside>
    </div>
  );
}

function ScoreCard({ label, value, color, muted }: { label: string; value: number; color?: string; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-border gradient-card p-3 text-center">
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        {color && <span className={cn("h-2.5 w-2.5 rounded-full", color)} />}
        {label}
      </div>
      <div className={cn("mt-1 text-2xl font-bold", muted && "text-muted-foreground")}>{value}</div>
    </div>
  );
}
