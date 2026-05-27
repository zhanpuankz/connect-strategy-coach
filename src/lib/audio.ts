// Premium WebAudio synthesized UI sounds — no external assets.
// All sounds are soft, short, and non-gamey (Apple-like UI feel).

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let muted = false;

const MUTE_KEY = "c4-muted";

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.6;
      masterGain.connect(ctx.destination);
      try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch {}
    } catch { return null; }
  }
  if (ctx?.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

// One-time unlock on first user gesture (iOS / Chrome autoplay policy)
if (typeof window !== "undefined") {
  const unlock = () => { ac(); };
  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true });
}

type ToneOpts = {
  freq: number;
  type?: OscillatorType;
  dur?: number;
  attack?: number;
  release?: number;
  gain?: number;
  detune?: number;
  slideTo?: number;
  delay?: number;
  filterFreq?: number;
};

function tone(opts: ToneOpts) {
  const c = ac(); if (!c || !masterGain || muted) return;
  const t0 = c.currentTime + (opts.delay ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = opts.filterFreq ?? 6000;

  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, t0);
  if (opts.detune) osc.detune.value = opts.detune;
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + (opts.dur ?? 0.2));

  const dur = opts.dur ?? 0.18;
  const attack = opts.attack ?? 0.005;
  const release = opts.release ?? 0.12;
  const peak = opts.gain ?? 0.18;

  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + attack);
  g.gain.setValueAtTime(peak, t0 + dur);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);

  osc.connect(filt).connect(g).connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + release + 0.05);
}

function noise(durSec: number, gain: number, filterFreq: number, sweep?: { from: number; to: number }) {
  const c = ac(); if (!c || !masterGain || muted) return;
  const t0 = c.currentTime;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * durSec), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filt = c.createBiquadFilter();
  filt.type = "bandpass";
  filt.Q.value = 1.2;
  filt.frequency.setValueAtTime(sweep?.from ?? filterFreq, t0);
  if (sweep) filt.frequency.exponentialRampToValueAtTime(sweep.to, t0 + durSec);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durSec);
  src.connect(filt).connect(g).connect(masterGain);
  src.start(t0);
  src.stop(t0 + durSec + 0.05);
}

// ───────────── Public sounds ─────────────

export const sfx = {
  click() {
    // Soft tactile click — quick muted blip
    tone({ freq: 720, type: "triangle", dur: 0.02, attack: 0.002, release: 0.06, gain: 0.09, filterFreq: 2400 });
    tone({ freq: 1480, type: "sine", dur: 0.015, attack: 0.001, release: 0.04, gain: 0.05, delay: 0.005, filterFreq: 3200 });
  },
  hover() {
    // Whisper-light selection tone
    tone({ freq: 1200, type: "sine", dur: 0.02, attack: 0.002, release: 0.05, gain: 0.04, filterFreq: 4000 });
  },
  drop() {
    // Wood-on-felt thock: low body + soft noise tail
    tone({ freq: 220, type: "sine", dur: 0.04, attack: 0.002, release: 0.16, gain: 0.22, slideTo: 110, filterFreq: 1200 });
    noise(0.12, 0.06, 900, { from: 1800, to: 400 });
  },
  victory() {
    // Warm rising arpeggio (C–E–G–C)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone({
      freq: f, type: "sine", dur: 0.18, attack: 0.01, release: 0.35,
      gain: 0.16, delay: i * 0.09, filterFreq: 5000,
    }));
    notes.forEach((f, i) => tone({
      freq: f * 2, type: "triangle", dur: 0.12, attack: 0.01, release: 0.3,
      gain: 0.05, delay: i * 0.09 + 0.005, filterFreq: 6000,
    }));
  },
  defeat() {
    // Soft descending minor (A–F–D)
    const notes = [440, 349.23, 293.66];
    notes.forEach((f, i) => tone({
      freq: f, type: "sine", dur: 0.28, attack: 0.02, release: 0.4,
      gain: 0.14, delay: i * 0.18, filterFreq: 2200,
    }));
  },
  draw() {
    // Two neutral chimes
    tone({ freq: 523.25, type: "sine", dur: 0.18, attack: 0.01, release: 0.32, gain: 0.12, filterFreq: 4000 });
    tone({ freq: 523.25, type: "sine", dur: 0.22, attack: 0.01, release: 0.38, gain: 0.1, delay: 0.18, filterFreq: 4000 });
  },
  whoosh() {
    // Cinematic reveal — filtered noise sweep with subtle sub
    noise(0.9, 0.18, 3000, { from: 200, to: 4000 });
    tone({ freq: 140, type: "sine", dur: 0.5, attack: 0.05, release: 0.5, gain: 0.08, slideTo: 320, filterFreq: 800 });
  },
  impact() {
    // Premium win-line impact — low thump + sparkle
    tone({ freq: 80, type: "sine", dur: 0.08, attack: 0.002, release: 0.35, gain: 0.3, slideTo: 40, filterFreq: 600 });
    noise(0.25, 0.12, 5000, { from: 6000, to: 1500 });
    tone({ freq: 2200, type: "sine", dur: 0.04, attack: 0.005, release: 0.22, gain: 0.07, delay: 0.02, filterFreq: 8000 });
  },
};

export function setMuted(v: boolean) {
  muted = v;
  try { localStorage.setItem(MUTE_KEY, v ? "1" : "0"); } catch {}
}
export function isMuted() {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(MUTE_KEY) === "1"; } catch { return false; }
}
