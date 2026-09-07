import { useCallback, useEffect, useRef, useState } from "react";
import {
  durationOf,
  PLATES,
  sample,
  type BriefingMode,
  type PlateId,
  type Snapshot,
} from "@/lib/briefing";
import { setMasterMuted, startBriefingAudio, stopBriefingAudio, unlockAudio } from "@/lib/audio-engine";
import { useIntro } from "@/lib/intro-store";
import { cn } from "@/lib/utils";
import { HudOverlay } from "./HudOverlay";
import { SparkField } from "./SparkField";
import { ValkyrieMark } from "./ValkyrieMark";
import { IndicatorRow, VacuumTubes } from "./VacuumTubes";

function usePrefersReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Plate({ id, opacity }: { id: PlateId; opacity: number }) {
  const meta = PLATES[id];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (opacity > 0.04) {
      const p = el.play();
      if (p) void p.catch(() => {});
    } else {
      el.pause();
    }
  }, [opacity]);

  if (opacity <= 0.01) return null;

  return (
    <div className={cn("cine-plate", meta.ken ? `ken-${meta.ken}` : "")} style={{ opacity }}>
      {meta.vid ? (
        <video
          ref={videoRef}
          src={meta.vid}
          poster={meta.img}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        />
      ) : (
        <img src={meta.img} alt="" crossOrigin="anonymous" />
      )}
    </div>
  );
}

function Gate({
  seen,
  reduced,
  onAuthorize,
}: {
  seen: boolean;
  reduced: boolean;
  onAuthorize: () => void;
}) {
  const [spark, setSpark] = useState(false);
  const lock = useRef(false);

  const go = useCallback(() => {
    if (lock.current) return;
    lock.current = true;
    if (!seen && !reduced) unlockAudio();
    setSpark(true);
    window.setTimeout(() => onAuthorize(), 420);
  }, [onAuthorize, reduced, seen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        go();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div
      className="cine"
      onPointerUp={go}
      onClick={go}
      role="presentation"
    >
      <div className="cine-grid" style={{ opacity: 0.55 }} />
      <div className="cine-vignette" />
      <div className="cine-scan" />
      <div className="cine-grain" />
      <SparkField intensity={spark ? 1 : 0.08} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 py-8 text-center">
        <p className="mb-3 font-mono text-[9px] tracking-[0.42em] text-filament sm:text-[10px]">
          VALKYRIE AERO · FLIGHT OPERATIONS
        </p>
        <ValkyrieMark className="gate-mark mb-3 w-44 max-w-[58vw] sm:w-56" />
        <h1 className="font-display text-xl font-semibold tracking-[0.16em] text-paper sm:text-3xl">
          A-29 SUPER TUCANO PILOT TRAINING
        </h1>
        <p className="mt-3 max-w-xl font-mono text-[9px] leading-relaxed tracking-[0.2em] text-fog sm:text-[10px]">
          MILITARY AIR SCHOOL · ADVANCED FLIGHT INSTRUCTION · MISSION READINESS
        </p>
        <div className="gate-brief mt-6" aria-label="Program briefing">
          <div><span>PLATFORM</span><strong>A-29</strong></div>
          <div><span>MISSION</span><strong>TRAIN</strong></div>
          <div><span>BASE</span><strong>FALCON FIELD</strong></div>
        </div>
        <div className="my-6 opacity-90 sm:my-8">
          <VacuumTubes amount={0.55} />
        </div>
        <button
          type="button"
          className={cn("authorize", spark && "spark")}
          onPointerDown={(e) => {
            e.stopPropagation();
            go();
          }}
          onClick={(e) => {
            e.stopPropagation();
            go();
          }}
        >
          <span className="relative z-[1]">
            {reduced ? "ENTER" : seen ? "RE-AUTHORIZE" : "AUTHORIZE"}
          </span>
          <span className="fill" />
        </button>
        <p className="mt-6 font-mono text-[10px] tracking-[0.18em] text-fog/80">
          {reduced
            ? "MOTION REDUCED · DIRECT ENTRY"
            : seen
              ? "CLICK ANYWHERE · SHORT BRIEFING"
              : "CLICK ANYWHERE · ENTER FLIGHT BRIEFING · CHORAL AUDIO"}
        </p>
      </div>
    </div>
  );
}

function Briefing({
  mode,
  muted,
  onDone,
  onSkip,
  onToggleMuted,
}: {
  mode: BriefingMode;
  muted: boolean;
  onDone: () => void;
  onSkip: () => void;
  onToggleMuted: () => void;
}) {
  const [snap, setSnap] = useState<Snapshot>(() => sample(0, mode));
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t0 = performance.now();
    doneRef.current = false;
    startBriefingAudio(mode, muted);
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(durationOf(mode), Math.max(0, now - t0));
      setSnap(sample(t, mode));
      if (t >= durationOf(mode)) {
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stopBriefingAudio();
    };
    // muted is applied in a separate effect so toggling sound does not restart
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    setMasterMuted(muted);
  }, [muted]);

  const shakeX = Math.sin(snap.t * 0.08) * snap.shake * 3.2;
  const shakeY = Math.cos(snap.t * 0.11) * snap.shake * 2.2;
  const splitting = snap.split > 0.12;

  return (
    <div className={cn("cine", splitting && "doors-open")}>
      <div
        className={cn("cine-stage", snap.freeze > 0.6 && "cine-freeze")}
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px)`,
          opacity: snap.stageFade,
        }}
      >
        {(Object.keys(PLATES) as PlateId[]).map((id) => (
          <Plate key={id} id={id} opacity={snap.plates[id]} />
        ))}
        <div className="cine-grid" style={{ opacity: snap.grid * 0.9 }} />
        <div className="cine-vignette" />
        <div className="cine-scan" />
        <div className="cine-grain" />
        <SparkField intensity={snap.logoSpark} />

        <div
          className="pointer-events-none absolute inset-0 z-[7] flex flex-col items-center justify-center px-6"
          style={{ opacity: Math.max(snap.logo, snap.tubes * 0.5, snap.scramble) }}
        >
          <div style={{ opacity: snap.tubes }} className="mb-8">
            <VacuumTubes amount={snap.tubes} />
            <div className="mt-4">
              <IndicatorRow amount={snap.tubes} />
            </div>
          </div>
          <ValkyrieMark
            className="w-40 sm:w-56"
          />
          <p className="scramble-word mt-5" style={{ opacity: snap.scramble }}>
            {snap.scrambleText}
          </p>
          {snap.authorized && snap.scramble > 0.2 ? (
            <p className="mt-3 font-mono text-[10px] tracking-[0.32em] text-filament">
              RESPONSE AUTHORIZED
            </p>
          ) : null}
        </div>

        <HudOverlay snap={snap} />
      </div>

      <div
        className="cine-letterbox top"
        style={{ opacity: snap.letterbox, transform: `scaleY(${0.6 + snap.letterbox * 0.4})` }}
      />
      <div className="cine-letterbox bot" style={{ opacity: snap.letterbox }} />

      <div
        className="logo-half l flex items-center justify-center"
        style={{ opacity: snap.split > 0.02 ? 1 : 0 }}
      >
        <ValkyrieMark className="w-44 sm:w-56" />
      </div>
      <div
        className="logo-half r flex items-center justify-center"
        style={{ opacity: snap.split > 0.02 ? 1 : 0 }}
      >
        <ValkyrieMark className="w-44 sm:w-56" />
      </div>

      <div
        className="door door-l"
        style={{
          backgroundImage: "url(/cinematic/06-hangar-doors.jpg)",
          opacity: snap.seam > 0.02 || snap.split > 0 ? 1 : 0,
        }}
      />
      <div
        className="door door-r"
        style={{
          backgroundImage: "url(/cinematic/06-hangar-doors.jpg)",
          opacity: snap.seam > 0.02 || snap.split > 0 ? 1 : 0,
        }}
      />
      <div className={cn("seam", snap.seam > 0.08 && "on")} style={{ opacity: snap.seam }} />

      {snap.caption ? (
        <div className="pointer-events-none absolute bottom-[14%] left-1/2 z-20 w-[min(92%,42rem)] -translate-x-1/2 border border-filament/30 bg-void/70 px-4 py-2 text-center font-mono text-[10px] tracking-[0.18em] text-phosphor backdrop-blur-sm sm:text-[11px]">
          {snap.caption}
        </div>
      ) : null}

      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-3">
        <div className="h-[2px] w-24 bg-steel sm:w-32">
          <div className="h-full bg-filament" style={{ width: `${snap.progress * 100}%` }} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="skip-btn"
            aria-pressed={muted}
            onClick={onToggleMuted}
          >
            {muted ? "SOUND ON" : "SOUND OFF"}
          </button>
          <button type="button" className="skip-btn" onClick={onSkip}>
            SKIP
          </button>
        </div>
      </div>
    </div>
  );
}

export function CinematicIntro() {
  const overlay = useIntro((s) => s.overlay);
  const mode = useIntro((s) => s.mode);
  const muted = useIntro((s) => s.muted);
  const seen = useIntro((s) => s.seen);
  const play = useIntro((s) => s.play);
  const complete = useIntro((s) => s.complete);
  const skip = useIntro((s) => s.skip);
  const setMuted = useIntro((s) => s.setMuted);
  const hydrateSeen = useIntro((s) => s.hydrateSeen);
  const reduced = usePrefersReduced();

  useEffect(() => {
    hydrateSeen();
  }, [hydrateSeen]);

  const authorize = () => {
    if (reduced) {
      skip();
      return;
    }
    play();
  };

  if (overlay === "idle") return null;

  if (overlay === "gate") {
    return <Gate seen={seen} reduced={reduced} onAuthorize={authorize} />;
  }

  return (
    <Briefing
      mode={mode}
      muted={muted}
      onDone={complete}
      onSkip={skip}
      onToggleMuted={() => setMuted(!muted)}
    />
  );
}
