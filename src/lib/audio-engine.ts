import { FULL_MS } from "./briefing";

const MAX_VOLUME = 0.3;
const FADE_IN_MS = 4_000;
const FADE_OUT_MS = 5_000;

let briefingAudio: HTMLAudioElement | null = null;
let fadeFrame = 0;
let masterMuted = false;
let startedAt = 0;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!briefingAudio) {
    briefingAudio = new Audio(`${import.meta.env.BASE_URL}audio/usaf-song-choral.mp3`);
    briefingAudio.preload = "auto";
    briefingAudio.volume = 0;
  }
  return briefingAudio;
}

function cancelFade() {
  if (fadeFrame) cancelAnimationFrame(fadeFrame);
  fadeFrame = 0;
}

function setVolume(value: number) {
  if (briefingAudio) briefingAudio.volume = masterMuted ? 0 : Math.min(MAX_VOLUME, Math.max(0, value));
}

function animateMix() {
  const elapsed = performance.now() - startedAt;
  const fadeIn = Math.min(1, elapsed / FADE_IN_MS);
  const fadeOut = Math.min(1, Math.max(0, (FULL_MS - elapsed) / FADE_OUT_MS));
  setVolume(MAX_VOLUME * Math.min(fadeIn, fadeOut));
  if (elapsed < FULL_MS && briefingAudio && !briefingAudio.paused) {
    fadeFrame = requestAnimationFrame(animateMix);
  }
}

/** Begin playback at zero volume while the visitor's entry gesture is active. */
export function unlockAudio() {
  const audio = getAudio();
  if (!audio || !audio.paused) return;
  audio.currentTime = 0;
  audio.volume = 0;
  void audio.play().catch(() => {});
}

export function setMasterMuted(muted: boolean) {
  masterMuted = muted;
  if (muted) setVolume(0);
}

export function stopBriefingAudio() {
  cancelFade();
  if (!briefingAudio) return;
  briefingAudio.pause();
  briefingAudio.currentTime = 0;
  briefingAudio.volume = 0;
}

export function startBriefingAudio(mode: "full" | "short", muted: boolean) {
  masterMuted = muted;
  if (mode !== "full") {
    stopBriefingAudio();
    return;
  }

  const audio = getAudio();
  if (!audio) return;
  startedAt = performance.now();
  cancelFade();
  if (audio.paused) void audio.play().catch(() => {});
  fadeFrame = requestAnimationFrame(animateMix);
}
