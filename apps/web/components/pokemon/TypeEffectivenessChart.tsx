import type { TypeEffectiveness } from "@/graphql/generated/operations";

export function formatEffectiveness(multiplier: number): string {
  if (multiplier === 4) return "4×";
  if (multiplier === 2) return "2×";
  if (multiplier === 1) return "1×";
  if (multiplier === 0.5) return "½×";
  if (multiplier === 0.25) return "¼×";
  if (multiplier === 0) return "0×";
  return `${multiplier}×`;
}

function multiplierColor(m: number): string {
  if (m >= 4) return "#EF5350";
  if (m >= 2) return "#FF7043";
  if (m === 0) return "#546E7A";
  if (m <= 0.25) return "#26A69A";
  if (m <= 0.5) return "#42A5F5";
  return "var(--text-muted)";
}

export function TypeEffectivenessChart({
  effectiveness,
}: {
  effectiveness: TypeEffectiveness[];
}) {
  const sorted = [...effectiveness].sort((a, b) => b.multiplier - a.multiplier);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {sorted.map((te) => (
        <div
          key={te.attacker}
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 text-center text-xs"
        >
          <div className="text-[var(--text-muted)] uppercase tracking-wide mb-1">
            {te.attacker.toLowerCase()}
          </div>
          <div
            className="font-bold text-sm"
            style={{ color: multiplierColor(te.multiplier) }}
          >
            {formatEffectiveness(te.multiplier)}
          </div>
        </div>
      ))}
    </div>
  );
}
