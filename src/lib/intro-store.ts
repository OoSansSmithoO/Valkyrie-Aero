import { create } from "zustand";
import { SEEN_KEY, type BriefingMode } from "./briefing";

type Overlay = "gate" | "playing" | "idle";

type IntroState = {
  overlay: Overlay;
  mode: BriefingMode;
  muted: boolean;
  seen: boolean;
  play: (mode?: BriefingMode) => void;
  complete: () => void;
  skip: () => void;
  setMuted: (muted: boolean) => void;
  hydrateSeen: () => void;
};

function readSeen() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export const useIntro = create<IntroState>((set, get) => ({
  overlay: "gate",
  mode: "full",
  muted: false,
  seen: false,
  hydrateSeen: () => {
    const seen = readSeen();
    set({ seen, mode: seen ? "short" : "full" });
  },
  play: (mode) => {
    const next = mode ?? (get().seen ? "short" : "full");
    set({ overlay: "playing", mode: next });
  },
  complete: () => {
    writeSeen();
    set({ overlay: "idle", seen: true });
  },
  skip: () => {
    writeSeen();
    set({ overlay: "idle", seen: true });
  },
  setMuted: (muted) => set({ muted }),
}));
