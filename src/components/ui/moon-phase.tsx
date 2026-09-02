import { moonPhase } from "@/lib/astronomy/moon";

export function MoonPhaseWidget({ date }: { date?: Date }) {
  const mp = moonPhase(date);
  const shadowWidth = ((1 - mp.illumination / 100) * 100);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-ink/60 px-4 py-3">
      <div className="relative h-10 w-10 shrink-0 rounded-full bg-ink-3">
        <div className="absolute inset-0 rounded-full bg-starlight/90" />
        {shadowWidth > 0.5 && (
          <div
            className="absolute inset-0 rounded-full bg-ink-3"
            style={{
              clipPath: `ellipse(${Math.max(shadowWidth / 2, 0)}% 50% at ${mp.phase < 0.5 ? 25 : 75}% 50%)`,
            }}
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-starlight">{mp.name}</p>
        <p className="text-[0.7rem] text-subdued">{mp.illumination}% illuminated</p>
      </div>
    </div>
  );
}
