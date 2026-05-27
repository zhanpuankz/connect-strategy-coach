import { createFileRoute } from "@tanstack/react-router";
import { GameArena } from "@/components/game/GameArena";
import { Leaderboard } from "@/components/game/Leaderboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Brain, Zap, Target, Sparkles, ArrowRight } from "lucide-react";
import { sfx } from "@/lib/audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connect Four Arena — Train tactical thinking" },
      { name: "description", content: "A premium Connect Four training app with AI coach, difficulty levels, match history, and post-game analysis." },
      { property: "og:title", content: "Connect Four Arena" },
      { property: "og:description", content: "Train tactical thinking with AI-coached Connect Four games." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Ambient room lighting */}
      <div className="pointer-events-none fixed inset-0 -z-10 gradient-hero" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] -z-10 rounded-full opacity-60 animate-ambient"
           style={{ background: "radial-gradient(closest-side, oklch(0.66 0.22 22 / 0.18), transparent)" }} />

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-white/[0.04]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <a href="#top" onClick={() => sfx.click()} className="flex items-center gap-2.5">
            <div className="flex gap-0.5">
              <span className="h-3 w-3 rounded-full bg-player-1 disc-shadow" />
              <span className="h-3 w-3 rounded-full bg-player-2 disc-shadow" />
            </div>
            <span className="font-semibold tracking-tight">Connect Four Arena</span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="#play"
              onClick={() => sfx.click()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-spring hover:scale-[1.04]"
            >
              <Sparkles className="h-3.5 w-3.5" /> Start training
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-28 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-1.5 text-[11px] font-medium tracking-wide animate-fade-up">
            <Sparkles className="h-3 w-3 text-primary" />
            Strategy training, powered by AI coaching
          </div>
          <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-[-0.04em] animate-fade-up">
            Sharpen your<br />
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">tactical thinking.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground animate-fade-up font-light leading-relaxed">
            A focused practice tool for Connect Four. Short matches, immediate AI feedback,
            and the calm interface of a real training app.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
            <a
              href="#play"
              onClick={() => sfx.click()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-shadow transition-spring hover:scale-[1.04]"
            >
              Start playing <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#why"
              onClick={() => sfx.click()}
              className="inline-flex items-center rounded-full glass px-6 py-3.5 text-sm font-semibold transition-spring hover:scale-[1.02]"
            >
              How it helps you learn
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <Feature icon={<Brain className="h-4 w-4" />} title="AI Coach" body="Plain-language feedback after every match." />
            <Feature icon={<Target className="h-4 w-4" />} title="3 difficulty levels" body="Easy, Medium, and a real Hard challenge." />
            <Feature icon={<Zap className="h-4 w-4" />} title="Instant analysis" body="Missed blocks, center control, diagonal threats." />
          </div>
        </div>
      </section>

      {/* Game */}
      <section id="play" className="mx-auto max-w-6xl px-5 pb-24">
        <GameArena />
      </section>

      {/* Why + Leaderboard */}
      <section id="why" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Why train here</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
              A small game.<br />A real skill loop.
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed">
              Connect Four looks simple but rewards strategy: center control, double threats, diagonal traps.
              We turn each short game into a learning loop so you actually improve, not just play.
            </p>
            <ul className="space-y-4 pt-2">
              {[
                ["Short games, fast feedback", "Each match takes under 3 minutes. The coach explains what worked and what didn't right after."],
                ["Built for beginners and students", "Plain English, no chess notation. Just clear, actionable hints."],
                ["Progression that sticks", "Beat Easy, then Medium, then Hard. Your scoreboard and history travel with you."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm tracking-tight">{t}</div>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Leaderboard />
        </div>
      </section>

      <footer className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Connect Four Arena</span>
          <span>A strategy training prototype.</span>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl glass p-5 text-left transition-spring hover:scale-[1.02]">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="font-semibold text-sm tracking-tight">{title}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground font-light leading-relaxed">{body}</p>
    </div>
  );
}
