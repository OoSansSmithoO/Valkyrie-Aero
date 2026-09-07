import type { Snapshot } from "@/lib/briefing";
import { STATUS_LINES, STACK } from "@/lib/briefing";
import { cn } from "@/lib/utils";

const GIMBAL_COPY: Record<Snapshot["gimbal"], string> = {
  off: "",
  init: "GIMBAL INITIALIZING",
  online: "GIMBAL ONLINE",
  search: "GIMBAL ONLINE  ·  SEARCH",
  acquire: "GIMBAL ONLINE  ·  ACQUIRE",
  track: "GIMBAL ONLINE  ·  TRACK",
  stable: "TRACK STABLE",
  fused: "SENSOR FUSED",
};

export function HudOverlay({ snap }: { snap: Snapshot }) {
  if (snap.hud <= 0.01) return null;
  const g = snap.gimbal;
  const showReticle = g !== "off" && g !== "init";
  const trackOn = g === "acquire" || g === "track" || g === "stable" || g === "fused";
  const expand = snap.split;

  return (
    <div className="hud" style={{ opacity: snap.hud * (1 - snap.split * 0.85) }}>
      <div className="horizon-layer" style={{ transform: `rotate(${snap.bank}deg)`, opacity: snap.horizon }}>
        <div className="horizon-bar" />
        <div
          className="absolute top-1/2 left-[12%] right-[12%] -translate-y-6 text-center font-mono text-[10px] tracking-[0.4em] text-phosphor/70"
        >
          5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;──┼──&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5
        </div>
      </div>

      {showReticle ? (
        <div className="reticle" style={{ opacity: 0.9 }}>
          <div className="reticle-box" />
        </div>
      ) : null}

      {trackOn ? (
        <div
          className="track-box"
          style={{
            left: `${48 - expand * 48}%`,
            top: `${46 - expand * 46}%`,
            width: `${10 + expand * 90}%`,
            height: `${12 + expand * 88}%`,
            opacity: 0.85 * (1 - expand * 0.5),
          }}
        />
      ) : null}

      <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-[12px] font-medium tracking-[0.28em] text-phosphor">
            {GIMBAL_COPY[g] || "LINK 01"}
          </div>
          {g !== "off" && g !== "init" ? (
            <div className="hud-aux mt-2 text-[10px] tracking-[0.18em] text-filament/80">
              GUNS&nbsp;&nbsp; SHAHED TRACK
            </div>
          ) : null}
        </div>
        <div className="hud-aux text-right text-[10px] tracking-[0.2em] text-phosphor/80">
          <div>NAV&nbsp;&nbsp;GOOD</div>
          <div className="mt-1">LINK 01</div>
        </div>
      </div>

      <div className="hud-aux absolute top-1/2 left-5 -translate-y-1/2 text-[10px] tracking-[0.18em]">
        <div className="text-fog">ALT</div>
        <div className="mt-1 font-medium tabular-nums text-phosphor">
          {Math.round(snap.alt).toString().padStart(4, "0")}
        </div>
      </div>

      {trackOn ? (
        <div className="absolute top-[38%] right-[12%] text-[10px] tracking-[0.16em] text-phosphor">
          <div className="flex items-center gap-2">
            <span className="diamond" />
            <span>TRACK 02</span>
          </div>
          <div className="mt-1 text-fog">AIRBORNE OBJECT</div>
          <div className="mt-1 tabular-nums text-filament">
            CONFIDENCE {Math.round(snap.confidence)}%
          </div>
        </div>
      ) : null}

      {snap.remoteTrack ? (
        <div className="absolute right-[18%] bottom-[28%] text-[10px] tracking-[0.16em] text-phosphor/90">
          <div className="flex items-center gap-2">
            <span className="diamond" />
            <span>NODE 03</span>
          </div>
          <div className="mt-1 text-fog">REMOTE TRACK RECEIVED</div>
        </div>
      ) : null}

      {snap.statusOn ? (
        <div className="absolute bottom-8 left-5 space-y-1 text-[10px] tracking-[0.18em] text-phosphor/85">
          {STATUS_LINES.map((line) => (
            <div key={line.k} className="flex gap-3">
              <span className="w-44 text-fog">{line.k}</span>
              <span
                className={cn(
                  "tabular-nums",
                  line.v === "HUMAN" || line.v === "ACTIVE" ? "text-filament" : "text-phosphor",
                )}
              >
                {line.v}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="hud-aux absolute right-5 bottom-8 text-right text-[10px] tracking-[0.16em] text-fog">
        <div>AUTONOMY: ACTIVE</div>
        <div className="mt-1 text-filament">MISSION AUTHORITY: HUMAN</div>
      </div>

      {g === "online" || g === "search" || g === "acquire" || g === "track" || g === "stable" || g === "fused" ? (
        <div className="hud-aux pointer-events-none absolute top-[22%] left-1/2 hidden w-max -translate-x-1/2 flex-col items-center gap-1 text-[9px] tracking-[0.22em] text-phosphor/55 sm:flex">
          {STACK.map((s) => (
            <div key={s}>{s}</div>
          ))}
        </div>
      ) : null}

      <div
        className="hud-expand"
        style={{
          opacity: Math.min(1, snap.hud),
        }}
      >
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </div>
    </div>
  );
}
