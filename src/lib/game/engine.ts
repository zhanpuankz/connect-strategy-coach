export type Cell = 0 | 1 | 2;
export type Board = Cell[][];
export const ROWS = 6;
export const COLS = 7;

export const createBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);

export const cloneBoard = (b: Board): Board => b.map((r) => [...r]);

export const getDropRow = (b: Board, col: number): number => {
  for (let r = ROWS - 1; r >= 0; r--) if (b[r][col] === 0) return r;
  return -1;
};

export const isColFull = (b: Board, col: number) => b[0][col] !== 0;
export const isBoardFull = (b: Board) => b[0].every((c) => c !== 0);

export const validCols = (b: Board): number[] =>
  Array.from({ length: COLS }, (_, c) => c).filter((c) => !isColFull(b, c));

export const drop = (b: Board, col: number, player: Cell): { board: Board; row: number } | null => {
  const r = getDropRow(b, col);
  if (r < 0) return null;
  const nb = cloneBoard(b);
  nb[r][col] = player;
  return { board: nb, row: r };
};

const DIRS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

export type WinLine = { player: Cell; cells: [number, number][] } | null;

export const checkWin = (b: Board): WinLine => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = b[r][c];
      if (!p) continue;
      for (const [dr, dc] of DIRS) {
        const cells: [number, number][] = [[r, c]];
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k, nc = c + dc * k;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
          if (b[nr][nc] !== p) break;
          cells.push([nr, nc]);
        }
        if (cells.length === 4) return { player: p, cells };
      }
    }
  }
  return null;
};
