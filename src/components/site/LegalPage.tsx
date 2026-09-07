import { ValkyrieMark } from "@/components/intro/ValkyrieMark";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, updated, children }: Props) {
  return (
    <main className="min-h-dvh bg-void text-paper">
      <header className="site-nav">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <a href="../" className="flex items-center gap-3">
            <ValkyrieMark className="h-10 w-10 object-contain" />
            <span className="font-display text-base font-semibold tracking-[0.18em]">VALKYRIE AERO</span>
          </a>
          <a href="../" className="font-mono text-[10px] tracking-[0.2em] text-filament hover:text-paper">
            RETURN TO AIRFIELD
          </a>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-20">
        <p className="font-mono text-[10px] tracking-[0.3em] text-filament">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-wide sm:text-6xl">{title}</h1>
        <p className="mt-3 font-mono text-[9px] tracking-[0.18em] text-fog">LAST UPDATED · {updated}</p>
        <div className="legal-copy mt-12">{children}</div>
      </article>
    </main>
  );
}
