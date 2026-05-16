/**
 * Circular arc showing confidence percentage.
 */
export function ConfRing({ value, size = 80 }) {
  const r = 34, cx = 40, cy = 40, strokeW = 7;
  const circumference = 2 * Math.PI * r;
  const progress   = Math.min(1, (value || 0) / 100);
  const dashOffset = circumference * (1 - progress);
  const color = value > 70 ? "#10b981" : value > 40 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label={`Confidence: ${value}%`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border2)" strokeWidth={strokeW} />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
        strokeDasharray={circumference} strokeDashoffset={dashOffset}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset .5s ease" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize="15" fontWeight="800" fontFamily="IBM Plex Mono,monospace">
        {value}%
      </text>
    </svg>
  );
}