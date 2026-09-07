export const SEEN_KEY = "ss.briefing.v1";
export const FULL_MS = 26500;
export const SHORT_MS = 7600;

export type BriefingMode = "full" | "short";

export type GimbalState =
  | "off"
  | "init"
  | "online"
  | "search"
  | "acquire"
  | "track"
  | "stable"
  | "fused";

export type PlateId =
  | "tubes"
  | "fos"
  | "operator"
  | "hero"
  | "launch"
  | "formation"
  | "gimbal"
  | "bank"
  | "doors";

export type Snapshot = {
  t: number;
  duration: number;
  progress: number;
  grid: number;
  tubes: number;
  tubeFlicker: number;
  logo: number;
  logoSpark: number;
  scramble: number;
  scrambleText: string;
  shake: number;
  plates: Record<PlateId, number>;
  hud: number;
  horizon: number;
  bank: number;
  freeze: number;
  split: number;
  seam: number;
  caption: string | null;
  statusOn: boolean;
  gimbal: GimbalState;
  alt: number;
  confidence: number;
  remoteTrack: boolean;
  authorized: boolean;
  stageFade: number;
  letterbox: number;
};

function clamp(n: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, n));
}

function smooth(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

/** Envelope: 0 before in0, 1 between in1 and out0, 0 after out1. */
export function env(t: number, in0: number, in1: number, out0: number, out1: number) {
  if (t <= in0 || t >= out1) return 0;
  if (t < in1) return smooth((t - in0) / Math.max(1, in1 - in0));
  if (t <= out0) return 1;
  return 1 - smooth((t - out0) / Math.max(1, out1 - out0));
}

function emptyPlates(): Record<PlateId, number> {
  return {
    tubes: 0,
    fos: 0,
    operator: 0,
    hero: 0,
    launch: 0,
    formation: 0,
    gimbal: 0,
    bank: 0,
    doors: 0,
  };
}

const SCRAMBLE = "SCRAMBLE";

function scrambleAt(t: number, start: number) {
  if (t < start) return "";
  const letters = Math.min(SCRAMBLE.length, Math.floor((t - start) / 90) + 1);
  return SCRAMBLE.slice(0, letters);
}

function gimbalFull(t: number): GimbalState {
  if (t < 16800) return "off";
  if (t < 17600) return "init";
  if (t < 18600) return "online";
  if (t < 19400) return "search";
  if (t < 20200) return "acquire";
  if (t < 21400) return "track";
  if (t < 22600) return "stable";
  return "fused";
}

function captionFull(t: number): string | null {
  if (t >= 5200 && t < 7800) return "A-29  Super Tucano — Gunslinger airborne.";
  if (t >= 9800 && t < 11800) return "SHAHED  Group 2–3 in track.";
  if (t >= 18800 && t < 20800) return "KINETIC  Guns hot — below and behind.";
  if (t >= 21400 && t < 23200) return "SHAHED  Track 02 falling.";
  return null;
}

export function sampleFull(t: number): Snapshot {
  const duration = FULL_MS;
  const plates = emptyPlates();
  plates.tubes = env(t, 1400, 2600, 6200, 8200);
  plates.hero = env(t, 6400, 7600, 8600, 9800) * 0.85;
  plates.fos = env(t, 8200, 9400, 10800, 12200);
  plates.operator = env(t, 10000, 10500, 11200, 12000);
  plates.launch = env(t, 11200, 12200, 14200, 15600);
  plates.formation = env(t, 14800, 16000, 17600, 19000);
  plates.gimbal = env(t, 17200, 18400, 21400, 22800);
  plates.bank = env(t, 20600, 21600, 23000, 23800);
  plates.doors = env(t, 23200, 23800, 25800, 26500);

  const split = env(t, 23400, 25200, 26500, 28000);
  const freeze = t >= 22900 && t < 23280 ? 1 : env(t, 22750, 22900, 23280, 23450);
  const logo = env(t, 3800, 5200, 8000, 9800) + env(t, 22800, 23400, 24200, 25200) * 0.6;
  const tubes = env(t, 1600, 4200, 8600, 10200);

  return {
    t,
    duration,
    progress: clamp(t / duration),
    grid: env(t, 200, 1800, 24000, 26000),
    tubes,
    tubeFlicker: tubes > 0.2 ? 0.6 + Math.sin(t * 0.013) * 0.2 : 0,
    logo: clamp(logo),
    logoSpark: env(t, 4200, 4600, 6200, 7600),
    scramble: env(t, 5800, 7000, 8400, 9800),
    scrambleText: scrambleAt(t, 5900),
    shake: env(t, 4600, 5000, 6400, 7600),
    plates,
    hud: env(t, 10800, 12400, 25000, 26500),
    horizon: env(t, 17000, 18600, 23200, 24600),
    bank: t < 20600 ? 0 : t > 23200 ? 32 * (1 - split) : 32 * smooth((t - 20600) / 2200),
    freeze,
    split,
    seam: env(t, 23240, 23600, 24400, 25600),
    caption: captionFull(t),
    statusOn: t >= 11200 && t < 23600,
    gimbal: gimbalFull(t),
    alt: t < 11200 ? 40 : Math.min(2140, 40 + ((t - 11200) / 9000) * 2100),
    confidence: t < 19400 ? 0 : t < 21400 ? 71 + ((t - 19400) / 2000) * 23 : 94,
    remoteTrack: t >= 21400 && t < 24000,
    authorized: t >= 9800,
    stageFade: t < 25200 ? 1 : 1 - smooth((t - 25200) / 1300),
    letterbox: env(t, 0, 800, 24800, 26500) * 0.9,
  };
}

function gimbalShort(t: number): GimbalState {
  if (t < 1800) return "off";
  if (t < 2400) return "init";
  if (t < 3200) return "online";
  if (t < 4000) return "track";
  if (t < 4800) return "stable";
  return "fused";
}

export function sampleShort(t: number): Snapshot {
  const duration = SHORT_MS;
  const plates = emptyPlates();
  plates.tubes = env(t, 0, 400, 1800, 2800);
  plates.gimbal = env(t, 1600, 2400, 4600, 5600);
  plates.doors = env(t, 5000, 5600, 7200, 7600);

  const split = env(t, 5200, 6800, 7600, 8200);
  const freeze = t >= 4800 && t < 5120 ? 1 : 0;

  return {
    t,
    duration,
    progress: clamp(t / duration),
    grid: env(t, 0, 400, 6800, 7600),
    tubes: env(t, 80, 900, 2400, 3400),
    tubeFlicker: 0.7,
    logo: env(t, 400, 1100, 2800, 4200) + env(t, 5000, 5400, 6200, 7200) * 0.5,
    logoSpark: env(t, 700, 1100, 1800, 2600),
    scramble: env(t, 1200, 1800, 2400, 3200),
    scrambleText: scrambleAt(t, 1200),
    shake: env(t, 900, 1200, 1800, 2400),
    plates,
    hud: env(t, 1800, 2600, 7000, 7600),
    horizon: env(t, 2400, 3200, 5200, 6400),
    bank: t < 3600 ? 0 : t > 5200 ? 18 * (1 - split) : 24 * smooth((t - 3600) / 1400),
    freeze,
    split,
    seam: env(t, 5100, 5450, 6400, 7300),
    caption: t >= 2800 && t < 4600 ? "A-29  Gunslinger · Shahed below and behind." : null,
    statusOn: t >= 2000 && t < 5400,
    gimbal: gimbalShort(t),
    alt: 1840,
    confidence: t < 3000 ? 0 : 94,
    remoteTrack: t >= 3800 && t < 5600,
    authorized: true,
    stageFade: t < 6800 ? 1 : 1 - smooth((t - 6800) / 800),
    letterbox: env(t, 0, 200, 6800, 7600),
  };
}

export function sample(t: number, mode: BriefingMode): Snapshot {
  return mode === "short" ? sampleShort(t) : sampleFull(t);
}

export function durationOf(mode: BriefingMode) {
  return mode === "short" ? SHORT_MS : FULL_MS;
}

export const PLATES: Record<
  PlateId,
  { img: string; vid?: string; ken?: "in" | "out" | "left" }
> = {
  tubes: { img: "cinematic/07-vacuum-tubes.jpg", ken: "in" },
  fos: { img: "cinematic/02-fos-dawn.jpg", vid: "cinematic/02-fos-dawn.mp4", ken: "in" },
  operator: { img: "cinematic/05-operator.jpg", ken: "in" },
  hero: { img: "cinematic/01-hero-uav.jpg", ken: "in" },
  launch: { img: "cinematic/03-launch.jpg", vid: "cinematic/03-launch.mp4", ken: "out" },
  formation: {
    img: "cinematic/04-formation.jpg",
    vid: "cinematic/04-formation.mp4",
    ken: "left",
  },
  gimbal: { img: "cinematic/08-gimbal-eo.jpg", vid: "cinematic/08-gimbal-eo.mp4", ken: "in" },
  bank: { img: "cinematic/09-hard-bank.jpg", vid: "cinematic/09-hard-bank.mp4", ken: "left" },
  doors: { img: "cinematic/06-hangar-doors.jpg", vid: "cinematic/06-hangar-doors.mp4" },
};

export const STATUS_LINES = [
  { k: "SENSOR FUSION", v: "NOMINAL" },
  { k: "NAVIGATION", v: "NOMINAL" },
  { k: "DATA LINK", v: "NOMINAL" },
  { k: "MISSION AUTHORITY", v: "HUMAN" },
  { k: "AUTONOMY", v: "ACTIVE" },
] as const;

export const STACK = [
  "MULTI-SENSOR TRACKING",
  "THREAT CLASSIFICATION",
  "MISSION ASSIGNMENT",
  "COOPERATIVE AUTONOMY",
  "INTERCEPT",
] as const;
