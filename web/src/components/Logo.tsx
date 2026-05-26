/**
 * doc2quiz Logo
 * A document with a folded corner, overlaid with a checkmark circle.
 * Uses CSS custom property --p for the primary brand colour.
 */
export function LogoMark({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Document body */}
      <rect x="6" y="4" width="28" height="36" rx="4" fill="var(--pSoft)" />

      {/* Folded corner — top-right */}
      <path d="M34 4 L42 12 L34 12 Z" fill="var(--p)" opacity="0.25" />
      <path d="M34 4 L42 12 H34 V4Z" fill="var(--p)" opacity="0.15" />

      {/* Document lines (content) */}
      <rect x="12" y="16" width="16" height="2.5" rx="1.25" fill="var(--p)" opacity="0.35" />
      <rect x="12" y="21" width="12" height="2.5" rx="1.25" fill="var(--p)" opacity="0.25" />
      <rect x="12" y="26" width="14" height="2.5" rx="1.25" fill="var(--p)" opacity="0.25" />

      {/* Check circle badge — bottom-right */}
      <circle cx="34" cy="36" r="10" fill="var(--p)" />
      {/* Checkmark */}
      <path
        d="M29.5 36.2 L32.8 39.5 L38.5 33"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoFull({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark size={size} />
      <span
        style={{ fontSize: size * 0.42, letterSpacing: "-0.025em" }}
        className="font-semibold text-[var(--text)]"
      >
        doc2quiz
      </span>
    </div>
  );
}
