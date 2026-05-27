import { Board, Cell, COLS, ROWS, checkWin, drop, validCols } from "./engine";

export type Difficulty = "easy" | "medium" | "hard";

const other = (p: Cell): Cell => (p === 1 ? 2 : 1);

// Score a window of 4 cells
const scoreWindow = (w: Cell[], me: Cell): number => {
  const opp = other(me);
  const meC = w.filter((c) => c === me).length;
  const oppC = w.filter((c) => c === opp).length;
  const emptyC = w.filter((c) => c === 0).length;
  let s = 0;
  if (meC === 4) s += 100000;
  else if (meC === 3 && emptyC === 1) s += 50;
  else if (meC === 2 && emptyC === 2) s += 5;
  if (oppC === 3 && emptyC === 1) s -= 80;
  if (oppC === 4) s -= 100000;
  return s;
};

const positionScore = (b: Board, me: Cell): number => {
  let s = 0;
  // center preference
  for (let r = 0; r < ROWS; r++) if (b[r][3] === me) s += 6;
  // horizontal
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      s += scoreWindow([b[r][c], b[r][c + 1], b[r][c + 2], b[r][c + 3]], me);
  // vertical
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      s += scoreWindow([b[r][c], b[r + 1][c], b[r + 2][c], b[r + 3][c]], me);
  // diag down-right
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++)
      s += scoreWindow([b[r][c], b[r + 1][c + 1], b[r + 2][c + 2], b[r + 3][c + 3]], me);
  // diag up-right
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      s += scoreWindow([b[r][c], b[r - 1][c + 1], b[r - 2][c + 2], b[r - 3][c + 3]], me);
  return s;
};

const minimax = (
  b: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  me: Cell,
): number => {
  const win = checkWin(b);
  if (win) return win.player === me ? 100000 + depth : -100000 - depth;
  const cols = validCols(b);
  if (depth === 0 || cols.length === 0) return positionScore(b, me);

  if (maximizing) {
    let value = -Infinity;
    for (const c of cols) {
      const nb = drop(b, c, me)!.board;
      value = Math.max(value, minimax(nb, depth - 1, alpha, beta, false, me));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    const opp = other(me);
    for (const c of cols) {
      const nb = drop(b, c, opp)!.board;
      value = Math.min(value, minimax(nb, depth - 1, alpha, beta, true, me));
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
};

export const chooseMove = (b: Board, me: Cell, diff: Difficulty): number => {
  const cols = validCols(b);
  if (cols.length === 0) return -1;

  if (diff === "easy") {
    // 70% random, 30% take immediate win/block
    if (Math.random() < 0.7) return cols[Math.floor(Math.random() * cols.length)];
  }

  // Always check immediate win
  for (const c of cols) {
    const nb = drop(b, c, me)!.board;
    if (checkWin(nb)?.player === me) return c;
  }
  // Block opponent
  const opp = other(me);
  for (const c of cols) {
    const nb = drop(b, c, opp)!.board;
    if (checkWin(nb)?.player === opp) return c;
  }

  if (diff === "easy") return cols[Math.floor(Math.random() * cols.length)];

  const depth = diff === "medium" ? 3 : 5;
  let best = cols[0];
  let bestScore = -Infinity;
  // Prefer center
  const ordered = [...cols].sort((a, b) => Math.abs(3 - a) - Math.abs(3 - b));
  for (const c of ordered) {
    const nb = drop(b, c, me)!.board;
    const score = minimax(nb, depth - 1, -Infinity, Infinity, false, me);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
};
