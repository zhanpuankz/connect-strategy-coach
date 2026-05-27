import { createFileRoute } from "@tanstack/react-router";
import { GameArena } from "@/components/game/GameArena";
import { Leaderboard } from "@/components/game/Leaderboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Brain, Zap, Target, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connect Four Arena — Train tactical thinking" },
      { name: "description", content: "A modern Connect Four training platform with AI coach, difficulty levels, match history, and post-game analysis." },
      { property: "og:title", content: "Connect Four Arena" },
      { property: "og:description", content: "Train tactical thinking with AI-coached Connect Four games." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <span className="h-3 w-3 rounded-full bg-player-1" />
              <span className="h-3 w-3 rounded-full bg-player-2" />
            </div>
            <span className="font-bold tracking-tight">Connect Four Arena</span>
          </a>
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-105 transition-transform">
              <Sparkles className="h-3.5 w-3.5" /> Upgrade to Pro
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero opacity-10" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium animate-fade-up">
            <Sparkles className="h-3 w-3 text-primary" />
            Strategy training, powered by AI coaching
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight animate-fade-up">
            Sharpen your <span className="bg-gradient-to-r from-[oklch(0.55_0.22_270)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">tactical thinking</span>
            <br className="hidden sm:block" /> one move at a time.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground animate-fade-up">
            Connect Four Arena turns a classic game into a focused practice tool. Play short matches, get instant AI feedback, and build the habits of stronger players — beginners and students welcome.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
            <a href="#play" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground glow-shadow hover:scale-105 transition-transform">
              Start playing <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#why" className="inline-flex items-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent transition-colors">
              How it helps you learn
            </a>
          </div>

          {/* Feature pills */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <Feature icon={<Brain className="h-4 w-4" />} title="AI Coach" body="Plain-language feedback after every match." />
            <Feature icon={<Target className="h-4 w-4" />} title="3 difficulty levels" body="Easy, Medium, and a real Hard challenge." />
            <Feature icon={<Zap className="h-4 w-4" />} title="Instant analysis" body="Missed blocks, center control, diagonal threats." />
          </div>
        </div>
      </section>

      {/* Game */}
      <section id="play" className="mx-auto max-w-6xl px-4 pb-16">
        <GameArena />
      </section>

      {/* Why section + Leaderboard */}
      <section id="why" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Why train here?</h2>
            <p className="text-muted-foreground">
              Connect Four looks simple but rewards real strategy: center control, double threats, and diagonal traps. We turn each short game into a learning loop so you actually improve, instead of just playing.
            </p>
            <ul className="space-y-3">
              {[
                ["Short games, fast feedback", "Each match takes under 3 minutes. The coach explains what worked and what didn't right after."],
                ["Built for beginners and students", "Plain English, no chess notation. Just clear, actionable hints."],
                ["Progression that sticks", "Beat Easy, then Medium, then Hard. Your scoreboard and history travel with you."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-3">
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t}</div>
                    <p className="text-sm text-muted-foreground">{b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Leaderboard />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Connect Four Arena</span>
          <span>Built as a strategy training prototype.</span>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border gradient-card p-4 text-left">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
