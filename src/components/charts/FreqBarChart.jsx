import { ENGLISH_FREQ } from "../../engine/constants.js";
//import { LETTERS } from "./constants.js"; // Optional: Move LETTERS string to a constant file
import { LegendDot } from "./LegendDot";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * Grouped bar chart: compares up to three frequency distributions.
 */
export function FreqBarChart({ textFreq, cipherFreq, height = 220 }) {
  const EF = ENGLISH_FREQ;
  const maxVal = Math.max(
    ...ALPHABET.map(l => Math.max(EF[l], textFreq?.[l] || 0, cipherFreq?.[l] || 0))
  );

  const W = 780, PAD_L = 32, PAD_B = 28, PAD_T = 12;
  const chartH = height - PAD_B - PAD_T;
  const chartW = W - PAD_L - 4;
  const groupW = chartW / 26;
  const hasThree = textFreq && cipherFreq;
  const barW = hasThree ? groupW * 0.28 : groupW * 0.44;
  const gap  = hasThree ? groupW * 0.06 : 0;

  const y    = val => PAD_T + chartH - (val / (maxVal || 1)) * chartH;
  const barH = val => (val / (maxVal || 1)) * chartH;

  const ticks = [
    0,
    Math.round(maxVal * 0.25),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.75),
    Math.ceil(maxVal),
  ];

  return (
    <div className="freq-chart-wrap">
      <svg viewBox={`0 0 ${W} ${height}`} className="freq-chart-svg" aria-label="Letter frequency chart">
        {ticks.map(t => {
          const yy = y(t);
          return (
            <g key={t}>
              <line x1={PAD_L} y1={yy} x2={W - 4} y2={yy} stroke="#1f2133" strokeWidth="1" />
              <text x={PAD_L - 4} y={yy + 4} fill="#5a5f80" fontSize="9" textAnchor="end">{t}%</text>
            </g>
          );
        })}

        {ALPHABET.map((l, i) => {
          const xBase = PAD_L + i * groupW;
          const engH   = barH(EF[l]);
          const textH  = textFreq  ? barH(textFreq[l]  || 0) : 0;
          const ciphH  = cipherFreq? barH(cipherFreq[l]|| 0) : 0;

          let bars;
          if (hasThree) {
            bars = [
              { x: xBase + gap,                     h: ciphH, fill: "#4f8eff" },
              { x: xBase + gap + barW + 1.5,        h: textH, fill: "#10b981" },
              { x: xBase + gap + (barW + 1.5) * 2,  h: engH,  fill: "#5a5f80" },
            ];
          } else if (textFreq) {
            bars = [
              { x: xBase + gap + barW * 0.1,        h: textH, fill: "#4f8eff" },
              { x: xBase + gap + barW * 0.1 + barW + 3, h: engH, fill: "#5a5f80" },
            ];
          } else {
            bars = [{ x: xBase + groupW * 0.28, h: engH, fill: "#5a5f80" }];
          }

          const bw = bars.length === 3 ? barW : barW * 1.1;

          return (
            <g key={l}>
              {bars.map((b, bi) => (
                <rect
                  key={bi} x={b.x} y={y(0) - b.h} width={bw}
                  height={Math.max(b.h, 0)} fill={b.fill} opacity=".85" rx="2"
                />
              ))}
              <text
                x={xBase + groupW / 2} y={height - 8}
                fill="#5a5f80" fontSize="9" textAnchor="middle"
                fontFamily="IBM Plex Mono,monospace"
              >
                {l.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10, paddingLeft: PAD_L }}>
        {hasThree && <LegendDot color="#4f8eff" label="Cipher text" />}
        {hasThree && <LegendDot color="#10b981" label="Decrypted text" />}
        {textFreq && !cipherFreq && <LegendDot color="#4f8eff" label="Your text" />}
        <LegendDot color="#5a5f80" label="English baseline" />
      </div>
    </div>
  );
}