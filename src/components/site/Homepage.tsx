import { lazy, Suspense, useEffect, useState } from "react";
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

const NAV_ITEMS = [
  ["ABOUT", "#about"],
  ["TRAINING", "#training"],
  ["A-29", "#gunslinger"],
  ["SYSTEMS", "#capabilities"],
  ["DEMO", "#gimbal"],
  ["CONTACT", "#contact"],
] as const;

function Nav({ progress, dayOps, onTheme }: { progress: number; dayOps: boolean; onTheme: () => void }) {
  const play = useIntro((s) => s.play);
  const overlay = useIntro((s) => s.overlay);
  const [open, setOpen] = useState(false);
  return (
    <header className="site-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
        <a href="#top" className="flex items-center gap-2 text-paper sm:gap-3">
          <ValkyrieMark className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11" />
          <span className="whitespace-nowrap font-display text-[13px] font-semibold tracking-[0.12em] sm:text-lg sm:tracking-[0.18em]">
            VALKYRIE AERO
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map(([label, href]) => <a key={href} href={href} className="site-nav-link">{label}</a>)}
          <button type="button" className="nav-utility" onClick={onTheme}>{dayOps ? "NIGHT OPS" : "DAY OPS"}</button>
          {overlay === "idle" ? (
            <button type="button" className="replay-btn" onClick={() => play("full")}>
              REPLAY BRIEFING
            </button>
          ) : null}
        </nav>
        <button type="button" className="nav-utility md:hidden" aria-expanded={open} aria-controls="mobile-flight-menu" onClick={() => setOpen((value) => !value)}>
          {open ? "CLOSE" : "FLIGHT MENU"}
        </button>
      </div>
      <div className="mission-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      {open ? <nav id="mobile-flight-menu" className="mobile-flight-menu" aria-label="Mobile navigation">
        {NAV_ITEMS.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <button type="button" onClick={onTheme}>{dayOps ? "NIGHT OPS" : "DAY OPS"}</button>
        {overlay === "idle" ? <button type="button" onClick={() => { setOpen(false); play("full"); }}>REPLAY BRIEFING</button> : null}
      </nav> : null}
    </header>
  );
}

export function Homepage() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [dayOps, setDayOps] = useState(false);
  const [copied, setCopied] = useState<"email" | "address" | "page" | null>(null);

  useEffect(() => {
    try { setDayOps(window.localStorage.getItem("valkyrie.display") === "day"); } catch { /* preference storage is optional */ }
    const update = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(100, (window.scrollY / range) * 100) : 0);
      setShowTop(window.scrollY > window.innerHeight * 0.8);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    const sections = document.querySelectorAll("main section");
    sections.forEach((section) => section.classList.add("reveal-section"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    sections.forEach((section) => observer.observe(section));
    return () => { window.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);

  const toggleTheme = () => {
    setDayOps((value) => {
      const next = !value;
      try { window.localStorage.setItem("valkyrie.display", next ? "day" : "night"); } catch { /* preference storage is optional */ }
      return next;
    });
  };

  const copy = async (kind: "email" | "address" | "page", value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(kind); window.setTimeout(() => setCopied(null), 1800); } catch { setCopied(null); }
  };

  const year = new Date().getFullYear();
  return (
    <div id="top" className={`site-shell min-h-dvh bg-void text-paper ${dayOps ? "day-ops" : ""}`}>
      <a className="skip-to-content" href="#main-content">SKIP TO MISSION CONTENT</a>
      <Nav progress={progress} dayOps={dayOps} onTheme={toggleTheme} />

      <section id="main-content" className="relative overflow-hidden" tabIndex={-1}>
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
              EXPLORE PILOT TRAINING
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-3 border-t border-filament/20 pt-6 font-mono text-[10px] tracking-[0.2em] text-fog sm:grid-cols-5">
            {["MILITARY AIR SCHOOL", "JTAC TRAINING", "ADVANCED PILOT TRAINING", "A-29 SUPER TUCANO", "FALCON FIELD · ARIZONA"].map((item) => (
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
                loading="lazy"
                decoding="async"
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
          loading="lazy"
          decoding="async"
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

      <section id="faq" className="mx-auto max-w-4xl px-5 py-24">
        <p className="font-mono text-[10px] tracking-[0.3em] text-filament">MISSION BRIEF · FREQUENTLY ASKED</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-wide sm:text-5xl">Training questions, cleared.</h2>
        <div className="faq-list mt-10">
          {[
            ["Where is Valkyrie Aero based?", "Valkyrie Aero operates from Falcon Field Airport in Mesa, Arizona."],
            ["What training does Valkyrie Aero provide?", "Programs span cadet and foundational flight instruction, UPT and IFF-aligned development, advanced pilot instruction, JTAC training, and mission rehearsal."],
            ["Is the A-29 Gunslinger currently an operational program?", "The site presents Gunslinger as an emerging manned counter-UAS concept. Existing military training and aviation work remain Valkyrie Aero’s operational foundation."],
            ["How can a unit or partner begin a discussion?", "Contact Valkyrie Aero operations by email with the organization, training objective, location, and anticipated timeline."],
          ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
        <div className="contact-operations mt-12">
          <div>
            <p className="font-mono text-[9px] tracking-[0.24em] text-filament">OPEN A CHANNEL</p>
            <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide">Discuss a training requirement.</h3>
            <p className="mt-2 max-w-xl text-sm text-fog">Connect with Valkyrie Aero operations regarding training objectives, location, and anticipated timeline.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="explore inline-flex items-center" href="mailto:info@valkyrieaero.com?subject=Training%20Requirement%20Inquiry">CONTACT OPERATIONS</a>
            <button className="copy-btn min-h-12" type="button" aria-live="polite" onClick={() => copy("page", window.location.href)}>{copied === "page" ? "PAGE LINK COPIED" : "COPY PAGE LINK"}</button>
          </div>
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
            <a className="contact-link" href="https://www.google.com/maps/search/?api=1&query=4562+E+Mallory+Circle+Suite+104+Mesa+AZ+85215">4562 E MALLORY CIRCLE SUITE 104<br />MESA, AZ 85215 · FALCON FIELD AIRPORT</a>
            <a className="contact-link mt-3 block" href="mailto:info@valkyrieaero.com">INFO@VALKYRIEAERO.COM</a>
            <div className="mt-4 flex flex-wrap gap-2 print:hidden">
              <button className="copy-btn" type="button" onClick={() => copy("address", "4562 E Mallory Circle Suite 104, Mesa, AZ 85215")}>{copied === "address" ? "ADDRESS COPIED" : "COPY ADDRESS"}</button>
              <button className="copy-btn" type="button" onClick={() => copy("email", "info@valkyrieaero.com")}>{copied === "email" ? "EMAIL COPIED" : "COPY EMAIL"}</button>
            </div>
          </div>
        </div>
        <div className="border-t border-filament/15 px-5 py-4 text-center font-mono text-[9px] tracking-[0.2em] text-fog">
          <span className="usa-credit">
            <span className="css-us-flag" role="img" aria-label="United States flag"><i /></span>
            <span><b>CREATED IN THE USA</b> · SANCHEZ &amp; SCHMITT · {year}</span>
          </span>
          <nav className="mt-3 flex justify-center gap-5" aria-label="Legal">
            <a className="hover:text-paper" href="privacy/">PRIVACY</a>
            <a className="hover:text-paper" href="terms/">TERMS</a>
          </nav>
        </div>
      </footer>
      {showTop ? <button type="button" className="return-top print:hidden" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>RETURN TO FLIGHT LEVEL</button> : null}
    </div>
  );
}
