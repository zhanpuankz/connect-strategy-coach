# Connect Four Arena

A modern web-based strategy training platform built around Connect Four. Instead of being just another casual game, Connect Four Arena treats every match as a short, structured learning loop: play a quick game, get instant AI coaching, and build the tactical habits that separate strong players from beginners.

## Product description

Connect Four Arena is a tactical thinking trainer disguised as a familiar game. Each match takes under three minutes. After every game the AI Coach explains, in plain English, what happened on the board — missed blocks, missed wins, center control, diagonal threats — so users actually improve instead of just playing.

## Target users

- **Students** (12–22) who want a quick way to train logical and strategic thinking between classes.
- **Beginners** looking for an accessible entry point into strategy games without the steep learning curve of chess.
- **Casual players** who enjoy a short mental workout during the day.
- **Educators and parents** looking for a healthy, low-friction brain training tool.

## Features

### Core game
- 7×6 board with gravity-based disc dropping
- Two-player local mode
- Play vs AI with three difficulty levels: **Easy**, **Medium**, **Hard**
- Win detection: horizontal, vertical, and both diagonals
- Draw detection
- Winning line highlighted with an animated pulse
- Full-column protection and instant restart

### Product layer
- **AI Coach panel** after each match with plain-language insights:
  missed blocks, missed winning moves, center control, diagonal threat awareness
- **Match history** persisted in `localStorage` (last 50 games)
- **Scoreboard** that tracks wins, losses, and draws
- **Light & dark theme** with system preference detection
- **Mobile-first responsive design**
- **Landing section** explaining the product, value, and learning loop
- **Mock leaderboard** featuring players from Almaty
- **Mock "Upgrade to Pro"** CTA as a placeholder for future monetization

### Polish
- Smooth disc-drop and winning-line animations
- Hover-preview disc above each column
- Sticky translucent header
- Gradient-tinted hero with accessible color tokens

## AI architecture

- **Easy**: mostly random, but will always take an immediate win or block.
- **Medium**: alpha-beta minimax to depth 3 with positional heuristics (center control, threat windows).
- **Hard**: alpha-beta minimax to depth 5, with move ordering biased toward the center column for stronger pruning.

The coach replays the game move-by-move to detect missed defensive moves, missed winning drops, and center dominance, then surfaces them as short, friendly insights.

## Tech stack

- **React 19** + **TypeScript** (strict)
- **TanStack Start** + **TanStack Router** (file-based routing)
- **Tailwind CSS v4** with a semantic OKLCH design token system
- **Lucide React** icons
- **Vite 7** build tooling
- `localStorage` for match history, scoreboard, and theme — no backend required

## Why it's valuable

Most "brain training" apps are either too shallow (tap-the-color tests) or too steep (chess). Connect Four sits in the sweet spot: deep enough to teach real strategy concepts (forks, threats, tempo, center control), simple enough that a complete beginner can play in 30 seconds. By layering an AI Coach on top of a familiar game, we convert idle play time into measurable skill growth — and create a product surface that students, schools, and casual players can all use.

## Future roadmap

- **Accounts & cloud sync** (Lovable Cloud) so progress travels across devices
- **Skill rating system** (ELO-style) and ranked ladders
- **Real online multiplayer** with matchmaking
- **Daily puzzles**: "Find the winning move in 1" / "Block the threat"
- **Lesson packs**: guided drills on forks, sevens, odd-even threats
- **Replay viewer** with step-through and coach annotations on each move
- **Pro tier**: deeper coach analysis, unlimited history, opening trainer, puzzle streaks
- **School / classroom dashboards** for teachers tracking student progress
- **Localization** (Russian, Kazakh, English) for the regional market

## Local development

```bash
bun install
bun run dev
```

Then open the preview URL printed in the terminal.
