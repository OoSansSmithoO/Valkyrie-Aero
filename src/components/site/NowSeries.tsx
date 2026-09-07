const FILES = [
  {
    ep: "07",
    grp: "COUNTER-UAS  GRP  2-3",
    kicker: null as string | null,
    title: ["AMERICA IS RATIONING", "ITS AIR DEFENSE."],
    titleRed: 1,
    body: "US commanders are deliberately letting some missiles and drones through, accepting hits on runways, radars and fuel depots, to preserve interceptors that take years to replace. Rationing is what a broken cost exchange looks like.",
    stats: [
      { n: "~9,000", l: "PROJECTILES SINCE FEBRUARY" },
      { n: "YEARS", l: "TO REPLACE AN INTERCEPTOR" },
      { n: "SOME", l: "THREATS NOW WAVED THROUGH" },
    ],
    img: "cinematic/03-launch.jpg",
  },
  {
    ep: "10",
    grp: "COUNTER-UAS  GRP  2-3",
    kicker: "CASE FILE  ·  2022–2026  ·  THE FLANK UNDER DRONES",
    title: ["NATO’S EAST"],
    titleRed: -1,
    body: "Romania: 33 incursions, now three kills. Poland and Latvia: violations of their own. In May a stray drone hit an apartment building inside the EU. The drone war has NATO addresses now, and the standing answer is fighter scrambles and half million dollar missiles.",
    fielded: "QRA FIGHTERS  ·  AIM-9X  ·  PATCHWORK POINT DEFENSE",
    punch: "THE FLANK NEEDS A HUNTER.",
    stats: [
      { n: "33", l: "INCURSIONS, ROMANIA ALONE", red: true },
      { n: "3", l: "NATO STATES REPORTING THEM" },
      { n: "1", l: "APARTMENT HIT INSIDE THE EU" },
    ],
    img: "cinematic/09-hard-bank.jpg",
  },
  {
    ep: "06",
    grp: "COUNTER-UAS  GRP  2-3",
    kicker: "CASE FILE  ·  24–26 JUL 2026  ·  THREE DAYS, THREE DRONES",
    title: ["ROMANIA"],
    titleRed: -1,
    body: "Three Shahed-type drones, three clean F-16 kills, NATO procedure working as written. The receipt: about 1.5 million euros, most of it 400 thousand dollar missiles fired at drones costing a fraction of that. Bucharest is already shopping for a cheaper way.",
    fielded: "F-16 + AIM-9X  ·  NATO AIR POLICING  ·  C-UAS ARRIVES NEXT YEAR",
    punch: "THE MATH FAILED, NOT THE PILOTS.",
    stats: [
      { n: "€1.5M", l: "THREE DRONES, THREE DAYS", red: true },
      { n: "$400K", l: "PER MISSILE FIRED" },
      { n: "33", l: "INCURSIONS SINCE 2022" },
    ],
  },
] as const;

export function NowSeries() {
  return (
    <section id="now" className="bg-void py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="now-bar" />
              <p className="font-mono text-[10px] tracking-[0.28em] text-paper">THE NOW SERIES</p>
            </div>
            <h2 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
              The cost exchange is already broken.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[10px] tracking-[0.16em] text-fog">
            COUNTER-UAS  ·  GRP 2–3  ·  VALKYRIEAERO.COM
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {FILES.map((file) => (
            <article key={file.ep} className="now-card flex flex-col overflow-hidden">
              {"img" in file && file.img ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={file.img}
                    alt=""
                    className="h-full w-full object-cover opacity-50"
                    loading="lazy"
                    decoding="async"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                </div>
              ) : (
                <div className="h-16 bg-void" />
              )}
              <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="now-bar" />
                    <span className="font-mono text-[10px] tracking-[0.22em] text-fog">
                      THE NOW SERIES  ·  {file.ep}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-fog">{file.grp}</span>
                </div>
                {file.kicker ? (
                  <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-filament">{file.kicker}</p>
                ) : (
                  <div className="mt-5" />
                )}
                <h3 className="mt-2 font-display text-3xl font-semibold leading-[0.95] tracking-wide">
                  {file.title.map((line, i) => (
                    <span
                      key={line}
                      className={i === file.titleRed ? "block text-[var(--color-usaf-red)]" : "block text-paper"}
                    >
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-fog">{file.body}</p>
                {"fielded" in file && file.fielded ? (
                  <p className="mt-4 font-mono text-[9px] tracking-[0.18em] text-fog">{file.fielded}</p>
                ) : null}
                {"punch" in file && file.punch ? (
                  <p className="mt-5 font-display text-xl font-semibold tracking-wide text-[var(--color-usaf-red)]">{file.punch}</p>
                ) : null}
                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                  {file.stats.map((s) => (
                    <div key={s.l}>
                      <div className={`now-stat text-2xl ${"red" in s && s.red ? "text-[var(--color-usaf-red)]" : "text-paper"}`}>
                        {s.n}
                      </div>
                      <div className="now-stat-rule" />
                      <p className="mt-2 font-mono text-[8px] leading-snug tracking-[0.14em] text-fog">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
