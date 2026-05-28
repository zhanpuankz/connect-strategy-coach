import { useState } from "react";
import { Lock, Trophy, Sparkles } from "lucide-react";
import { sfx } from "@/lib/audio";
import { PremiumModal } from "@/components/PremiumModal";

const skins = [
  { id: "graphite", name: "Graphite", g: "linear-gradient(135deg,#1a1a1d,#39393f)" },
  { id: "ember",    name: "Ember",    g: "linear-gradient(135deg,#ff5a3a,#ffb86b)" },
  { id: "ocean",    name: "Ocean",    g: "linear-gradient(135deg,#0c4a6e,#22d3ee)" },
  { id: "sakura",   name: "Sakura",   g: "linear-gradient(135deg,#9d174d,#f9a8d4)" },
  { id: "neo",      name: "Neon",     g: "linear-gradient(135deg,#4c1d95,#22d3ee)" },
  { id: "gold",     name: "Bullion",  g: "linear-gradient(135deg,#7c5c10,#fde68a)" },
];

export function SkinsPanel() {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState<string | undefined>();

  const lock = (label: string) => { sfx.click(); setFeature(label); setOpen(true); };

  return (
    <section className="space-y-8">
      {/* Skins */}
      <div className="rounded-[28px] gradient-card card-shadow p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Pro</div>
              <h3 className="font-semibold tracking-tight">Premium board skins</h3>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">Locked</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {skins.map((s) => (
            <button
              key={s.id}
              onClick={() => lock(`${s.name} skin`)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] transition-spring hover:scale-[1.04]"
              style={{ background: s.g }}
              aria-label={`${s.name} skin (locked)`}
            >
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center opacity-90 group-hover:opacity-70 transition-opacity">
                <Lock className="h-4 w-4 text-white/90" />
              </div>
              <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-medium text-white/90 tracking-wide">
                {s.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tournament */}
      <button
        onClick={() => lock("Tournament mode")}
        className="block w-full text-left rounded-[28px] gradient-card card-shadow p-6 sm:p-7 transition-spring hover:scale-[1.01]"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold tracking-tight">Tournament Mode</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                <Lock className="h-2.5 w-2.5" /> Pro
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              4 players compete in quick matches. Winners advance until one champion remains.
            </p>
          </div>
        </div>
      </button>

      <PremiumModal open={open} onClose={() => setOpen(false)} feature={feature} />
    </section>
  );
}
