export function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white"
      style={{ backgroundColor: color ?? "var(--accent)" }}
    >
      {label}
    </span>
  );
}
