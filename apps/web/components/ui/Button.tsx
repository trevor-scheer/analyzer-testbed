import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50",
  secondary:
    "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border)] disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-500 disabled:opacity-50",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50",
};

export function Button({
  variant = "primary",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${variantClasses[variant]} ${className}`}
    >
      {loading ? <span className="opacity-70">Loading…</span> : children}
    </button>
  );
}
