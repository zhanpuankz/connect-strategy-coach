import { Cell } from "./engine";

export type Mode = "local" | "ai-easy" | "ai-medium" | "ai-hard";

export type MatchResult = {
  id: string;
  date: number;
  mode: Mode;
  winner: Cell | 0;
  moves: number;
  duration: number;
};

const HISTORY_KEY = "c4a:history";
const SCORE_KEY = "c4a:score";
const THEME_KEY = "c4a:theme";

export const loadHistory = (): MatchResult[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
};
export const saveMatch = (m: MatchResult) => {
  const h = loadHistory();
  h.unshift(m);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50)));
};
export const clearHistory = () => localStorage.removeItem(HISTORY_KEY);

export type Score = { p1: number; p2: number; draws: number };
export const loadScore = (): Score => {
  if (typeof window === "undefined") return { p1: 0, p2: 0, draws: 0 };
  try { return JSON.parse(localStorage.getItem(SCORE_KEY) || "{}") || { p1: 0, p2: 0, draws: 0 }; }
  catch { return { p1: 0, p2: 0, draws: 0 }; }
};
export const saveScore = (s: Score) => localStorage.setItem(SCORE_KEY, JSON.stringify(s));
export const resetScore = () => localStorage.removeItem(SCORE_KEY);

export const loadTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  const v = localStorage.getItem(THEME_KEY);
  if (v === "dark" || v === "light") return v;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
export const saveTheme = (t: "light" | "dark") => localStorage.setItem(THEME_KEY, t);
