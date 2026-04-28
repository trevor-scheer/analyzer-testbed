const STAT_MAX = 255;

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  specialAttack: "Sp. Atk",
  specialDefense: "Sp. Def",
  speed: "Spd",
};

export function StatBar({ stat, value }: { stat: string; value: number }) {
  const pct = Math.round((value / STAT_MAX) * 100);
  const color =
    value >= 100
      ? "#4CAF50"
      : value >= 70
        ? "#8BC34A"
        : value >= 50
          ? "#FFC107"
          : "#EF5350";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 text-right text-[var(--text-muted)] shrink-0">
        {STAT_LABELS[stat] ?? stat}
      </span>
      <span className="w-8 text-right tabular-nums">{value}</span>
      <div className="flex-1 rounded-full bg-[var(--surface-2)] h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
