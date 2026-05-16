/**
 * Horizontal bar chart for chi-squared candidate scores.
 */
export function ChiChart({ candidates }) {
  if (!candidates?.length) return null;

  const maxChi = Math.max(...candidates.map(c => c.chi));
  const W = 480, PAD_L = 52, BAR_H = 20, GAP = 6, PAD_T = 8, PAD_R = 70;
  const totalH = PAD_T + candidates.length * (BAR_H + GAP) - GAP + 12;

  return (
    <div className="chi-chart-wrap">
      <svg viewBox={`0 0 ${W} ${totalH}`} style={{ display: "block", width: "100%", maxWidth: W }}>
        <defs>
          <linearGradient id="bestGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#4f8eff" stopOpacity=".9" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity=".8" />
          </linearGradient>
        </defs>

        {candidates.map((c, i) => {
          const y      = PAD_T + i * (BAR_H + GAP);
          const fillW  = Math.max(2, ((maxChi - c.chi) / (maxChi || 1)) * (W - PAD_L - PAD_R));
          const isBest = i === 0;

          return (
            <g key={c.shift}>
              <text
                x={PAD_L - 6} y={y + BAR_H / 2 + 4}
                fill={isBest ? "#f59e0b" : "#5a5f80"}
                fontSize="11" fontFamily="IBM Plex Mono,monospace"
                textAnchor="end" fontWeight={isBest ? "700" : "400"}
              >
                ROT-{c.shift}
              </text>
              <rect x={PAD_L} y={y} width={W - PAD_L - PAD_R} height={BAR_H} fill="#13141f" rx="4" />
              <rect x={PAD_L} y={y} width={fillW} height={BAR_H} fill={isBest ? "url(#bestGrad)" : "#272940"} rx="4" />
              <text
                x={PAD_L + fillW + 6} y={y + BAR_H / 2 + 4}
                fill={isBest ? "#4f8eff" : "#5a5f80"}
                fontSize="10" fontFamily="IBM Plex Mono,monospace"
              >
                {c.chi.toFixed(2)}
              </text>
              {isBest && (
                <text
                  x={W - 4} y={y + BAR_H / 2 + 4}
                  fill="#f59e0b" fontSize="10"
                  fontFamily="IBM Plex Mono,monospace" textAnchor="end"
                >
                  ★ best
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}