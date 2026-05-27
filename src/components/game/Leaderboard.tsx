import { Crown, MapPin } from "lucide-react";

const players = [
  { name: "Aibek N.", city: "Almaty", rating: 2148, streak: 12 },
  { name: "Dinara K.", city: "Almaty", rating: 2096, streak: 8 },
  { name: "Timur S.", city: "Almaty", rating: 2014, streak: 5 },
  { name: "Aigerim B.", city: "Almaty", rating: 1987, streak: 9 },
  { name: "Ruslan A.", city: "Almaty", rating: 1922, streak: 3 },
  { name: "Madina T.", city: "Almaty", rating: 1880, streak: 6 },
  { name: "Yerlan M.", city: "Almaty", rating: 1845, streak: 4 },
  { name: "Saltanat O.", city: "Almaty", rating: 1810, streak: 7 },
];

export function Leaderboard() {
  return (
    <div className="rounded-2xl border border-border gradient-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold">Top players · Almaty</h3>
      </div>
      <ul className="space-y-2">
        {players.map((p, i) => (
          <li key={p.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className={`w-6 text-center font-mono font-bold ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {p.city} · {p.streak} win streak
                </div>
              </div>
            </div>
            <div className="font-mono text-sm font-semibold">{p.rating}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
