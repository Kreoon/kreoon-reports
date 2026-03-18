// ── ScoreBadge ────────────────────────────────────────
// Color-coded score display.
// 9-10 → gold  | 7-8 → green | 4-6 → purple (kreoon) | 0-3 → red
// No "use client" needed — purely presentational.

interface ScoreBadgeProps {
  score: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showMax?: boolean;
  className?: string;
}

// ── Color tiers ──
function getColorClasses(score: number, max: number): string {
  const normalized = (score / max) * 10;

  if (normalized >= 9) {
    // Gold — excellent
    return 'bg-yellow-400/15 text-yellow-300 border-yellow-400/30 shadow-yellow-400/10';
  }
  if (normalized >= 7) {
    // Green — good
    return 'bg-green-500/15 text-green-400 border-green-500/30 shadow-green-400/10';
  }
  if (normalized >= 4) {
    // Orange — average
    return 'bg-kreoon/15 text-kreoon border-kreoon/30 shadow-kreoon/10';
  }
  // Red — needs work
  return 'bg-red-500/15 text-red-400 border-red-500/30 shadow-red-400/10';
}

// ── Ring fill color for visual indicator ──
function getRingColor(score: number, max: number): string {
  const normalized = (score / max) * 10;
  if (normalized >= 9) return '#facc15'; // yellow-400
  if (normalized >= 7) return '#4ade80'; // green-400
  if (normalized >= 4) return '#7c3aed'; // kreoon
  return '#f87171'; // red-400
}

function getSizeClasses(size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm':
      return { container: 'h-10 w-10', text: 'text-sm font-bold', sub: 'text-[9px]', ring: 36 };
    case 'lg':
      return { container: 'h-20 w-20', text: 'text-3xl font-extrabold', sub: 'text-xs', ring: 72 };
    case 'md':
    default:
      return { container: 'h-14 w-14', text: 'text-xl font-extrabold', sub: 'text-[10px]', ring: 52 };
  }
}

export default function ScoreBadge({
  score,
  max = 10,
  size = 'md',
  showMax = true,
  className = '',
}: ScoreBadgeProps) {
  const colorClasses = getColorClasses(score, max);
  const ringColor = getRingColor(score, max);
  const sizeConfig = getSizeClasses(size);

  // SVG ring progress
  const radius = (sizeConfig.ring - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, score / max));
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeConfig.container} ${className}`}
      role="img"
      aria-label={`Score: ${score} de ${max}`}
    >
      {/* SVG ring */}
      <svg
        width={sizeConfig.ring}
        height={sizeConfig.ring}
        viewBox={`0 0 ${sizeConfig.ring} ${sizeConfig.ring}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={sizeConfig.ring / 2}
          cy={sizeConfig.ring / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        {/* Progress */}
        <circle
          cx={sizeConfig.ring / 2}
          cy={sizeConfig.ring / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>

      {/* Score text */}
      <div className="relative z-10 flex flex-col items-center leading-none">
        <span className={`${sizeConfig.text} tabular-nums`} style={{ color: ringColor }}>
          {score}
        </span>
        {showMax && (
          <span className={`${sizeConfig.sub} text-white/30 mt-0.5`}>/{max}</span>
        )}
      </div>
    </div>
  );
}

// ── Flat variant (pill badge without ring) ──
export function ScorePill({
  score,
  max = 10,
  label,
  className = '',
}: {
  score: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const colorClasses = getColorClasses(score, max);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm ${colorClasses} ${className}`}
    >
      {label && <span className="text-white/60">{label}</span>}
      <span>
        {score}
        {max !== 10 && <span className="text-current/60">/{max}</span>}
      </span>
    </span>
  );
}
