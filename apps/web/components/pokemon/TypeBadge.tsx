const TYPE_COLORS: Record<string, string> = {
  FIRE: "#FF6B35",
  WATER: "#4FC3F7",
  GRASS: "#81C784",
  ELECTRIC: "#FFD54F",
  PSYCHIC: "#F06292",
  ICE: "#80DEEA",
  DRAGON: "#7E57C2",
  DARK: "#546E7A",
  NORMAL: "#BCAAA4",
  FIGHTING: "#EF5350",
  POISON: "#AB47BC",
  GROUND: "#FFCA28",
  FLYING: "#90CAF9",
  BUG: "#AED581",
  ROCK: "#BDBDBD",
  GHOST: "#7986CB",
  STEEL: "#B0BEC5",
  FAIRY: "#F48FB1",
};

export function TypeBadge({ type }: { type: string }) {
  const color = TYPE_COLORS[type.toUpperCase()] ?? "#888";
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white"
      style={{ backgroundColor: color }}
    >
      {type.toLowerCase()}
    </span>
  );
}
