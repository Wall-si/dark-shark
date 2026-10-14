let ctx: AudioContext | null = null;

function context() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export type Tone = "tick" | "ok" | "deny" | "boot";

export function tone(kind: Tone, enabled: boolean) {
  if (!enabled) return;
  const c = context();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  const now = c.currentTime;
  gain.gain.setValueAtTime(0.0001, now);

  if (kind === "tick") {
    osc.type = "square";
    osc.frequency.setValueAtTime(1640, now);
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    osc.start(now);
    osc.stop(now + 0.04);
    return;
  }

  if (kind === "ok") {
    osc.type = "square";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.1);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.2);
    return;
  }

  if (kind === "boot") {
    osc.type = "square";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(620, now + 0.07);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.start(now);
    osc.stop(now + 0.18);
    return;
  }

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(98, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.18);
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.start(now);
  osc.stop(now + 0.24);
}
