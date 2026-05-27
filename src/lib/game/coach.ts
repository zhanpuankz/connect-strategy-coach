import { Board, Cell, COLS, ROWS, checkWin, cloneBoard, drop, validCols } from "./engine";

export type MoveRecord = { col: number; row: number; player: Cell };

export type CoachInsight = {
  title: string;
  body: string;
  tone: "positive" | "warning" | "info";
};

const other = (p: Cell): Cell => (p === 1 ? 2 : 1);

const countThreats = (b: Board, p: Cell): number => {
  let n = 0;
  for (const c of validCols(b)) {
    const nb = drop(b, c, p)!.board;
    if (checkWin(nb)?.player === p) n++;
  }
  return n;
};

const centerControl = (b: Board, p: Cell): number =>
  b.reduce((acc, row) => acc + (row[3] === p ? 1 : 0), 0);

export const analyzeGame = (
  moves: MoveRecord[],
  winner: Cell | 0,
  humanPlayer: Cell,
): CoachInsight[] => {
  const insights: CoachInsight[] = [];
  const opp = other(humanPlayer);

  // Replay to find missed blocks and missed wins
  let board: Board = Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
  let missedBlocks = 0;
  let missedWins = 0;
  let goodBlocks = 0;

  for (const m of moves) {
    if (m.player === humanPlayer) {
      // Did human have a winning move?
      for (const c of validCols(board)) {
        const nb = drop(board, c, humanPlayer)!.board;
        if (checkWin(nb)?.player === humanPlayer && c !== m.col) {
          missedWins++;
          break;
        }
      }
      // Did opponent threaten a win that human ignored?
      let oppThreat = -1;
      for (const c of validCols(board)) {
        const nb = drop(board, c, opp)!.board;
        if (checkWin(nb)?.player === opp) { oppThreat = c; break; }
      }
      if (oppThreat >= 0) {
        if (m.col === oppThreat) goodBlocks++;
        else missedBlocks++;
      }
    }
    board = cloneBoard(board);
    board[m.row][m.col] = m.player;
  }

  const humanCenter = centerControl(board, humanPlayer);
  const oppCenter = centerControl(board, opp);

  if (winner === humanPlayer) {
    insights.push({
      title: "Victory!",
      tone: "positive",
      body: "You connected four and closed out the game. Strong finish.",
    });
  } else if (winner === opp) {
    insights.push({
      title: "Tough loss",
      tone: "warning",
      body: "Your opponent got there first. Let's look at why.",
    });
  } else {
    insights.push({
      title: "Drawn battle",
      tone: "info",
      body: "Neither side broke through. The board filled with balanced play.",
    });
  }

  if (missedBlocks > 0) {
    insights.push({
      title: `${missedBlocks} missed block${missedBlocks > 1 ? "s" : ""}`,
      tone: "warning",
      body: "Your opponent had three-in-a-row and you played elsewhere. Always scan the board for an immediate threat before your own plan.",
    });
  }
  if (goodBlocks > 0) {
    insights.push({
      title: `${goodBlocks} solid defensive move${goodBlocks > 1 ? "s" : ""}`,
      tone: "positive",
      body: "You spotted the opponent's threat and shut it down. That habit wins games.",
    });
  }
  if (missedWins > 0) {
    insights.push({
      title: `${missedWins} missed winning move${missedWins > 1 ? "s" : ""}`,
      tone: "warning",
      body: "You had four-in-a-row available but played a different column. Slow down and check every column for a winning drop.",
    });
  }

  if (humanCenter > oppCenter) {
    insights.push({
      title: "Strong center control",
      tone: "positive",
      body: "You owned the middle column. Center stones contribute to more winning lines than any other square.",
    });
  } else if (oppCenter > humanCenter + 1) {
    insights.push({
      title: "Lost the center",
      tone: "warning",
      body: "Your opponent dominated the middle column. In Connect Four, the center is worth fighting for early.",
    });
  }

  // Diagonal hint
  const diagThreat = moves.some((m) => m.row > 0 && m.row < ROWS - 1 && m.col > 0 && m.col < COLS - 1);
  if (diagThreat && (missedBlocks > 0 || winner === opp)) {
    insights.push({
      title: "Watch for diagonal threats",
      tone: "info",
      body: "Diagonals are the trickiest threats to see. Train your eyes to scan both diagonal directions every turn.",
    });
  }

  return insights;
};
