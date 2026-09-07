import { cn } from "@/lib/utils";

const TUBE_COUNT = 7;

export function VacuumTubes({ amount }: { amount: number }) {
  return (
    <div className="tube-row" aria-hidden="true">
      {Array.from({ length: TUBE_COUNT }).map((_, i) => {
        const threshold = 0.08 + i * 0.11;
        const on = amount > threshold;
        return (
          <div
            key={i}
            className={cn("tube", on && "on")}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="tube-halo" />
            <div className="tube-glass">
              <div className="tube-filament" />
            </div>
            <div className="tube-base" />
            <div className="tube-pins" />
          </div>
        );
      })}
    </div>
  );
}

export function IndicatorRow({ amount }: { amount: number }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn("bulb", amount > 0.18 + i * 0.14 && "on")} />
      ))}
    </div>
  );
}
