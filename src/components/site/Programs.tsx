const TRAINING_PATHS = [
  {
    code: "01",
    title: "Military air school",
    copy: "Cadet and foundational flight training built around disciplined airmanship, repeatable standards, and a clear path into advanced military aviation.",
  },
  {
    code: "02",
    title: "JTAC training",
    copy: "Live, simulated, and blended close-air-support instruction for target acquisition, joint fires, deconfliction, and terminal attack control.",
  },
  {
    code: "03",
    title: "Advanced pilot training",
    copy: "Mission-focused instruction, rehearsal, and performance assessment for aviators operating complex systems in demanding environments.",
  },
] as const;

const OFFER_JTAC = [
  "Realistic Close Air Support (CAS) training using live, simulated, and blended live-virtual-constructive environments.",
  "Mission profiles that emulate A-10, AC-130, F-16, F/A-18, F-35, and other platform behaviors.",
  "Scalable packages for units and joint or coalition exercises at CONUS ranges and expeditionary locations.",
  "Combat-experienced JTACs, pilots, and mission planners delivering standards-based instruction.",
];

export function Programs() {
  return (
    <>
      <section id="about" className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-filament">VALKYRIE AERO</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
              Experience in the air. Technology for what comes next.
            </h2>
          </div>
          <div className="instrument-panel space-y-4 px-6 py-7 text-sm leading-relaxed text-fog sm:px-8">
            <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.24em] text-filament">
              <span className="status-lamp" /> OPERATIONAL FOUNDATION
            </div>
            <p>
              Valkyrie Aero is a U.S. defense tactical technology company delivering military
              flight training and air-to-ground training for the U.S. Air Force, U.S. Navy, NATO,
              and partner nations.
            </p>
            <p>
              Its mission-ready light-attack aircraft, experienced instructors, and responsive
              engineering connect today’s readiness requirements with rapidly changing battlefield
              needs.
            </p>
            <p className="text-paper">
              The through-line is practical: train American warfighters, field proven capability,
              and build the next defensive layer from operational experience.
            </p>
          </div>
        </div>
      </section>

      <section id="training" className="bg-hangar py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="font-mono text-[10px] tracking-[0.3em] text-filament">EXISTING MISSION · TRAINING</p>
          <h2 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-wide sm:text-5xl">
            From cadet foundations to combat-ready aircrew.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-fog">
            Valkyrie’s military air-school, JTAC, and pilot-training programs form the operational
            base of the company: people, aircraft, instruction, and mission rehearsal working as one
            readiness system.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TRAINING_PATHS.map((path) => (
              <article key={path.code} className="instrument-panel min-h-64 px-6 py-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-filament">PATH {path.code}</span>
                  <span className="status-lamp" />
                </div>
                <h3 className="mt-12 font-display text-3xl font-semibold tracking-wide">{path.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-fog">{path.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="jtac" className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-filament">JTAC TRAINING</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-wide">
              Train exactly as they will fight.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-fog">
              Valkyrie Aero delivers realistic, mission-focused air-to-ground instruction as a DoD
              prime contractor on a $5.7 billion USAF IDIQ. Seasoned instructors and mission-ready
              light-attack aircraft give Joint Terminal Attack Controllers relevant repetitions
              under realistic stressors.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fog">
              Training spans the kill chain from ISR cueing through terminal guidance, improving
              target acquisition, joint-fires coordination, deconfliction, and terminal attack
              control.
            </p>
          </div>
          <ul className="space-y-3">
            {OFFER_JTAC.map((item) => (
              <li key={item} className="instrument-panel px-5 py-5 text-sm leading-relaxed text-fog">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pilot" className="bg-hangar py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-filament">PILOT TRAINING</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-5xl">
              Forging adaptable military aviators.
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-fog">
              <p>
                In an era of high-tech flight and multi-domain operations, military aviators must
                master complex systems, integrate with joint forces, and execute precision missions
                under extreme conditions. Rigorous pilot training is the foundation for success.
              </p>
              <p>
                Comprehensive programs span cadet and foundational flight instruction,
                Undergraduate Pilot Training (UPT), Introduction to Fighter Fundamentals (IFF),
                and advanced mission-specific instruction aligned with U.S. Air Force methodologies
                and global partner-force standards.
              </p>
              <p>
                State-of-the-art simulators, mission-rehearsal systems, and data-driven performance
                assessment reinforce disciplined airmanship while advancing rapid decision-making,
                systems integration, and task management under pressure—producing measurable gains
                in crew proficiency and operational readiness.
              </p>
            </div>
          </div>
          <img
            src="cinematic/09-hard-bank.jpg"
            alt="A-29 Super Tucano in a hard bank"
            className="aspect-[16/10] w-full object-cover shadow-[0_0_0_1px_rgba(242,162,58,0.24)]"
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
          />
        </div>
      </section>

      <section id="gunslinger" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-filament">NEXT LAYER · MANNED cUAS</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
                VALKYRIE A-29 ‘Gunslinger’
              </h2>
            </div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-fog">FORGED BY NECESSITY · DRIVEN BY MISSION</p>
          </div>
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="instrument-panel space-y-4 px-6 py-7 text-sm leading-relaxed text-fog sm:px-8">
              <p>
                The A-29 Gunslinger is Valkyrie Aero’s emerging manned counter-UAS concept for
                cost-effective effects against Group 2 and Group 3 drones—an additional defensive
                layer for American warfighters facing persistent, asymmetric attacks.
              </p>
              <p>
                The concept integrates electronic warfare, weapons, sensors, and Valkyrie’s AI cUAS
                technology with the tandem cockpit, endurance, and agility of the A-29 Super Tucano.
              </p>
              <p className="text-paper">
                Existing training and aviation capability are the foundation. Gunslinger is the
                forward edge: matching the threat with sustainable engagement economics and human
                mission authority.
              </p>
              <a href="#gimbal" className="explore mt-4 inline-flex items-center">EXPLORE THE DEMO</a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <img src="brand/shahed.jpg" alt="Shahed-136 one-way attack drone" className="aspect-[16/9] w-full object-cover" loading="lazy" decoding="async" crossOrigin="anonymous" />
              <img src="cinematic/08-gimbal-eo.jpg" alt="A-29 counter-UAS mission visualization" className="aspect-[16/9] w-full object-cover" loading="lazy" decoding="async" crossOrigin="anonymous" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
