import { lazy, Suspense } from "react";
import { useIntro } from "@/lib/intro-store";
import { ValkyrieMark } from "@/components/intro/ValkyrieMark";
import { NowSeries } from "./NowSeries";
import { Programs } from "./Programs";

const GimbalDemo = lazy(() =>
  import("./GimbalDemo").then((m) => ({ default: m.GimbalDemo })),
);

const CAPABILITIES = [
  {
    id: "detect",
    kicker: "Detection",
    title: "Sensor fusion",
    shot: "Radar · EO/IR · RF",
    copy: "The opening grid is not decoration. Contacts enter as minimal symbols because the fusion layer has already associated radar, electro-optical and RF emitters into a single track.",
    img: "cinematic/02-fos-dawn.jpg",
  },
  {
    id: "classify",
    kicker: "Classification",
    title: "Perception & association",
    shot: "Airborne object · 94%",
    copy: "The system does not paint a red enemy. It reports an airborne object, a confidence, and a track ID — the language of a flight-test display, not a videogame.",
    img: "cinematic/08-gimbal-eo.jpg",
  },
  {
    id: "auth",
    kicker: "Authorization",
    title: "Human-on-the-loop C2",
    shot: "Mission authority · Human",
    copy: "Response is cleared by a person. Autonomy executes the intercept geometry. Those two lines sit together on purpose: authority stays human; the vehicle does not wait for a joystick.",
    img: "cinematic/05-operator.jpg",
  },
  {
    id: "launch",
    kicker: "Launch",
    title: "Mission & vehicle interface",
    shot: "A-29 airborne",
    copy: "The Super Tucano is the airframe. Chin ball gimbal, wing guns, pods. The briefing shows that aircraft — not a generic dart.",
    img: "cinematic/03-launch.jpg",
  },
  {
    id: "form",
    kicker: "Formation",
    title: "Cooperative autonomy",
    shot: "Node 03 · remote track",
    copy: "Vehicles separate, then share. A remote track arriving over the datalink is how distributed sensing is shown rather than explained.",
    img: "cinematic/04-formation.jpg",
  },
  {
    id: "gnc",
    kicker: "Navigation",
    title: "GNC & estimation",
    shot: "NAV GOOD",
    copy: "Bank, climb, datalink and a quiet NAV GOOD. Degraded navigation is designed for; the briefing never pretends GPS is guaranteed.",
    img: "cinematic/09-hard-bank.jpg",
  },
] as const;

function Nav() {
  const play = useIntro((s) => s.play);
  const overlay = useIntro((s) => s.overlay);
  return (
    <header className="site-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
        <a href="#top" className="flex items-center gap-2 text-paper sm:gap-3">
          <ValkyrieMark className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11" />
          <span className="whitespace-nowrap font-display text-[13px] font-semibold tracking-[0.12em] sm:text-lg sm:tracking-[0.18em]">
            VALKYRIE AERO
          </span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#about"
            className="min-h-11 inline-flex items-center px-2 font-mono text-[9px] tracking-[0.16em] text-fog hover:text-paper sm:px-3 sm:text-[10px] sm:tracking-[0.22em]"
          >
            ABOUT
          </a>
          <a
            href="#training"
            className="min-h-11 inline-flex items-center px-2 font-mono text-[9px] tracking-[0.16em] text-fog hover:text-paper sm:px-3 sm:text-[10px] sm:tracking-[0.22em]"
          >
            TRAINING
          </a>
          <a
            href="#gunslinger"
            className="hidden min-h-11 items-center px-3 font-mono text-[10px] tracking-[0.22em] text-fog hover:text-paper sm:inline-flex"
          >
            A-29
          </a>
          <a
            href="#capabilities"
            className="hidden min-h-11 items-center px-3 font-mono text-[10px] tracking-[0.22em] text-fog hover:text-paper sm:inline-flex"
          >
            SYSTEMS
          </a>
          <a
            href="#gimbal"
            className="hidden min-h-11 items-center px-3 font-mono text-[10px] tracking-[0.22em] text-fog hover:text-paper sm:inline-flex"
          >
            DEMO
          </a>
          <a
            href="#contact"
            className="min-h-11 inline-flex items-center px-2 font-mono text-[9px] tracking-[0.16em] text-fog hover:text-paper sm:px-3 sm:text-[10px] sm:tracking-[0.22em]"
          >
            CONTACT
          </a>
          {overlay === "idle" ? (
            <button type="button" className="replay-btn" onClick={() => play("full")}>
              REPLAY BRIEFING
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export function Homepage() {
  return (
    <div id="top" className="min-h-dvh bg-void text-paper">
      <Nav />

      <section className="relative overflow-hidden">
        <img
          src="brand/tucano-photo.jpg"
          alt="A-29 Super Tucano on a predawn ramp"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/60 to-void" />
        <div className="relative mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:pb-24">
          <div className="mb-10 flex items-end gap-5">
            <ValkyrieMark className="h-24 w-24 object-contain drop-shadow-[0_0_24px_rgba(242,162,58,0.28)] sm:h-32 sm:w-32" />
            <div className="pb-2">
              <p className="font-display text-xl font-semibold tracking-[0.24em] text-paper sm:text-2xl">
                VALKYRIE AERO
              </p>
              <p className="mt-2 font-mono text-[9px] tracking-[0.22em] text-filament">
                MISSION READY · AMERICAN ENGINEERED
              </p>
            </div>
          </div>
          <p className="font-mono text-[10px] tracking-[0.38em] text-filament">
            FLIGHT TRAINING · TACTICAL TECHNOLOGY · MISSION READINESS
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-wide text-paper sm:text-7xl">
            BUILT FOR THE AMERICAN WARFIGHTER
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg text-fog">
            Proven military air-school and mission training today. Emerging counter-UAS capability
            for the next layer of defense tomorrow.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#training" className="explore inline-flex items-center">
              EXPLORE TRAINING
            </a>
            <a href="#gunslinger" className="explore explore-secondary inline-flex items-center">
              A-29 GUNSLINGER
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-3 border-t border-filament/20 pt-6 font-mono text-[10px] tracking-[0.2em] text-fog sm:grid-cols-5">
            {["AIR SCHOOL", "JTAC", "PILOT", "MISSION SYSTEMS", "A-29"].map((item) => (
              <div key={item} className="py-1">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Programs />

      <NowSeries />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-mono text-[10px] tracking-[0.3em] text-filament">THE BRIEFING WAS THE ARCHITECTURE</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          Every shot corresponds to a capability.
        </h2>
        <p className="mt-5 max-w-2xl text-fog">
          The opener does not advertise. It runs the stack: detection, classification,
          authorization, launch, formation, navigation, intercept. The site is the same
          geometry, labeled.
        </p>
      </section>

      <section id="capabilities" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          {CAPABILITIES.map((cap) => (
            <article key={cap.id} className="cap-card overflow-hidden">
              <img
                src={cap.img}
                alt=""
                className="aspect-[16/9] w-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="px-5 py-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-filament">
                  {cap.kicker} · {cap.shot}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide">
                  {cap.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{cap.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="gimbal" className="bg-hangar py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-filament">GIMBAL ONLINE</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
                Pilot the turret. Bank the A-29.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-fog">
              Chin ball, wing .50s, gun pods. Mouse slews the gimbal. Hold fire.
              The airframe banks. The track does not.
            </p>
          </div>
          <Suspense fallback={<div className="aspect-[16/10] w-full bg-void hairline" />}>
            <GimbalDemo />
          </Suspense>
          <div className="mt-6 grid gap-4 font-mono text-[10px] tracking-[0.16em] text-fog sm:grid-cols-3">
            <div className="hairline bg-void px-4 py-4">CHIN BALL · WING .50 · PODS</div>
            <div className="hairline bg-void px-4 py-4 text-filament">HOLD FIRE · SPACE / LMB</div>
            <div className="hairline bg-void px-4 py-4">A BANKS LEFT · D BANKS RIGHT</div>
          </div>
        </div>
      </section>

      <section id="systems" className="mx-auto max-w-6xl px-5 py-24">
        <p className="font-mono text-[10px] tracking-[0.3em] text-filament">SYSTEMS</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-wide">
          The stack, in the order it actually runs.
        </h2>
        <ol className="mt-10 divide-y divide-filament/15 border-y border-filament/15">
          {[
            ["01", "Multi-sensor tracking", "Fused radar, EO/IR and RF into a common track file."],
            ["02", "Threat classification", "Perception, data association, confidence — not a kill flag."],
            ["03", "Mission assignment", "Human-cleared response, vehicle-level tasking."],
            ["04", "Cooperative autonomy", "Formation, datalink, remote tracks from other nodes."],
            ["05", "Intercept", "Trajectory planning and control. No weapons effects in the briefing."],
            ["06", "After-action", "Telemetry, analytics, and test evidence back on the ground."],
          ].map(([n, title, copy]) => (
            <li key={n} className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr_1.2fr] sm:items-baseline">
              <span className="font-mono text-[10px] tracking-[0.2em] text-filament">{n}</span>
              <h3 className="font-display text-2xl font-semibold tracking-wide">{title}</h3>
              <p className="text-sm text-fog">{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="airframe" className="bg-void">
        <div className="mx-auto max-w-6xl px-5 pt-24">
          <p className="font-mono text-[10px] tracking-[0.3em] text-filament">AIRFRAME REFERENCE</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
            A-29 Super Tucano
          </h2>
        </div>
        <img
          src="brand/tucano-line-side.jpg"
          alt="Embraer A-29 Super Tucano technical line drawing"
          className="mx-auto mt-8 w-full max-w-6xl object-contain"
          crossOrigin="anonymous"
        />
        <div className="mx-auto max-w-6xl px-5 py-12">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["11.38 m", "LENGTH"],
              ["11.14 m", "SPAN"],
              ["5-BLADE", "HARTZELL PROP"],
              ["CHIN GUNS", "WING .50 · PODS"],
            ].map(([v, k]) => (
              <div key={k} className="hairline bg-hangar px-4 py-5">
                <dt className="font-mono text-[10px] tracking-[0.22em] text-fog">{k}</dt>
                <dd className="mt-2 font-display text-2xl font-semibold tracking-wide text-paper sm:text-3xl">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer id="contact" className="border-t border-filament/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <ValkyrieMark className="h-12 w-12 object-contain" />
            <div>
              <div className="font-display text-sm tracking-[0.18em]">VALKYRIE AERO</div>
              <div className="font-mono text-[10px] tracking-[0.16em] text-fog">
                MILITARY FLIGHT TRAINING · TACTICAL AVIATION
              </div>
            </div>
          </div>
          <div className="max-w-sm font-mono text-[10px] leading-relaxed tracking-[0.14em] text-fog">
            <p>4562 E MALLORY CIRCLE SUITE 104</p>
            <p>MESA, AZ 85215 · FALCON FIELD AIRPORT</p>
            <p className="mt-2">INFO@VALKYRIEAERO.COM</p>
          </div>
        </div>
        <div className="border-t border-filament/15 px-5 py-4 text-center font-mono text-[9px] tracking-[0.2em] text-fog">
          <span className="usa-credit">
            <span className="css-us-flag" role="img" aria-label="United States flag"><i /></span>
            <span><b>CREATED IN THE USA</b> · SANCHEZ &amp; SCHMITT</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
