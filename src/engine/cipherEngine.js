// ═══════════════════════════════════════════════════════════════
// engine/cipherEngine.js
// Pure cipher math. Zero UI. Zero React. Zero side-effects.
// All functions are deterministic and unit-testable.
// ═══════════════════════════════════════════════════════════════

import {
  ENGLISH_FREQ,
  ALPHABET_SIZE,
  MIN_LETTERS_FOR_DETECTION,
  AUTODETECT_CANDIDATES,
} from "./constants.js";

// ─── Confidence thresholds ───────────────────────────────────────────────────
//
// Calibrated against real English text measurements.
// ENGLISH_FREQ is on a percentage scale (0–100), and getFrequency() also
// returns percentages, so chiSquared() output is length-independent.
// These thresholds operate directly on the raw bestChi value — no /total needed.
//
// Measured bestChi values for correct decryptions:
//   ~385 letters → chi ≈ 14–15   (excellent)
//   ~171 letters → chi ≈ 29      (good)
//   ~114 letters → chi ≈ 37      (good)
//   ~42  letters → chi ≈ 217     (marginal — short-text penalty also applied)
//   < 20 letters → unreliable    (blocked by MIN_LETTERS_FOR_DETECTION)
//
// Three signals combine to produce the final 0–100 confidence score:
//   1. Absolute chi score of best candidate  (is the result actually English-like?)
//   2. Separation ratio best/runner-up       (is the answer unambiguous?)
//   3. Short-text penalty                    (is there enough data?)

const CHI_THRESHOLDS = [
  { max: 20,       floor: 85, ceiling: 100 }, // excellent — near-perfect English match
  { max: 50,       floor: 60, ceiling: 84  }, // good match
  { max: 150,      floor: 35, ceiling: 59  }, // moderate
  { max: 300,      floor: 15, ceiling: 34  }, // weak
  { max: Infinity, floor: 0,  ceiling: 14  }, // very unlikely to be English
];

// If bestChi / runnerUpChi > this threshold, the two candidates are too close
// together and confidence is penalised. 0.5 means runner-up must be at least
// 2× worse than best for zero separation penalty.
const SEPARATION_RATIO_THRESHOLD = 0.5;

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Shift a single alphabetic character by `shift` positions.
 * Preserves case. Non-alpha characters must not be passed here.
 *
 * @param {string} ch     Single alpha character
 * @param {number} shift  Pre-normalised shift (0–25)
 * @returns {string}
 */
function shiftChar(ch, shift) {
  const base = ch >= "a" ? 97 : 65;
  return String.fromCharCode(
    ((ch.charCodeAt(0) - base + shift + ALPHABET_SIZE) % ALPHABET_SIZE) + base
  );
}

/**
 * Compute chi-squared statistic between observed text frequencies
 * and English baseline, for a given hypothesis shift.
 *
 * Both `textFreqMap` values and `ENGLISH_FREQ` values are on the same
 * percentage scale (0–100), so their difference is meaningful and the
 * result is length-independent across texts of different sizes.
 *
 * Lower chi-squared = better match to English under that shift.
 *
 * @param {Record<string,number>} textFreqMap  Per-letter frequencies, 0–100 scale
 * @param {number} shift  Shift hypothesis to test (0–25)
 * @returns {number}
 */
function chiSquared(textFreqMap, shift) {
  let chi = 0;
  for (let i = 0; i < ALPHABET_SIZE; i++) {
    const plainLetter  = String.fromCharCode(97 + i);
    const cipherLetter = String.fromCharCode(((i + shift) % ALPHABET_SIZE) + 97);
    const observed = textFreqMap[cipherLetter] || 0;
    const expected = ENGLISH_FREQ[plainLetter];
    chi += Math.pow(observed - expected, 2) / expected;
  }
  return chi;
}

/**
 * Compute a 0–100 confidence score from three independent signals.
 *
 * Signal 1 — absolute chi quality:
 *   Maps bestChi onto a score range via CHI_THRESHOLDS.
 *   This directly answers: "does the best candidate actually look like English?"
 *   The OLD formula (worstChi - bestChi) / worstChi only answered: "is one
 *   candidate better than the others?" — it gave 99–100% on plaintext input
 *   because the spread is large even when bestChi is near 0.
 *
 * Signal 2 — separation penalty:
 *   If the runner-up chi is close to the best chi, the result is ambiguous.
 *   Penalty up to 30 points when ratio > SEPARATION_RATIO_THRESHOLD.
 *
 * Signal 3 — short-text penalty:
 *   Fewer letters = less reliable frequency distribution.
 *   Penalty up to 40 points for very short inputs.
 *
 * @param {number} bestChi      χ² of the best (lowest-scoring) candidate
 * @param {number} runnerUpChi  χ² of the second-best candidate
 * @param {number} total        Number of alphabetic characters analysed
 * @returns {{ score: number, label: string }}
 */
function computeConfidence(bestChi, runnerUpChi, total) {
  // ── Signal 1: absolute chi quality ──────────────────────────────────────
  const band    = CHI_THRESHOLDS.find(t => bestChi < t.max);
  const bandIdx = CHI_THRESHOLDS.indexOf(band);
  const prevMax = bandIdx > 0 ? CHI_THRESHOLDS[bandIdx - 1].max : 0;

  // For the last (Infinity) band use a fixed width so interpolation does not NaN
  const bandWidth = band.max === Infinity ? 300 : band.max - prevMax;

  // positionInBand: 0 = at low-chi end of band (best), 1 = at high-chi end (worst)
  const positionInBand = Math.min((bestChi - prevMax) / bandWidth, 1);
  const bandRange      = band.ceiling - band.floor;
  const baseScore      = Math.round(band.ceiling - positionInBand * bandRange);

  // ── Signal 2: separation penalty ────────────────────────────────────────
  // ratio close to 0 = very separated (good), close to 1 = ambiguous (bad)
  const separationRatio   = runnerUpChi > 0 ? bestChi / runnerUpChi : 1;
  let   separationPenalty = 0;
  if (separationRatio > SEPARATION_RATIO_THRESHOLD) {
    const penaltyFraction =
      (separationRatio - SEPARATION_RATIO_THRESHOLD) /
      (1 - SEPARATION_RATIO_THRESHOLD);
    separationPenalty = Math.round(penaltyFraction * 30);
  }

  // ── Signal 3: short-text penalty ────────────────────────────────────────
  let shortTextPenalty = 0;
  if      (total < 20)  shortTextPenalty = 40;
  else if (total < 40)  shortTextPenalty = 25;
  else if (total < 80)  shortTextPenalty = 15;
  else if (total < 150) shortTextPenalty = 8;

  // ── Combine ──────────────────────────────────────────────────────────────
  const finalScore = Math.max(
    0,
    Math.min(100, baseScore - separationPenalty - shortTextPenalty)
  );

  let label;
  if      (finalScore >= 90) label = "Very high — reliable";
  else if (finalScore >= 70) label = "High match";
  else if (finalScore >= 45) label = "Moderate — review candidates";
  else if (finalScore >= 20) label = "Low — inspect manually";
  else                        label = "Very low — unreliable";

  return { score: finalScore, label };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Encrypt `text` using a Caesar shift of `shift`.
 * Non-alphabetic characters are passed through unchanged.
 *
 * @param {string} text
 * @param {number} shift  Integer 0–25
 * @returns {string}
 */
export function encrypt(text, shift) {
  const s = ((shift % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
  return text.replace(/[a-zA-Z]/g, ch => shiftChar(ch, s));
}

/**
 * Decrypt `text` using a Caesar shift of `shift`.
 * Equivalent to encrypt with the inverse shift.
 *
 * @param {string} text
 * @param {number} shift  Integer 0–25
 * @returns {string}
 */
export function decrypt(text, shift) {
  const s = ((shift % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
  return encrypt(text, ALPHABET_SIZE - s);
}

/**
 * Build a letter frequency map for `text`.
 * Only counts alphabetic characters (case-insensitive).
 * Returned frequencies are on a percentage scale (0–100) to match ENGLISH_FREQ.
 *
 * @param {string} text
 * @returns {{ freq: Record<string,number>, counts: Record<string,number>, total: number }}
 */
export function getFrequency(text) {
  const counts = {};
  let total = 0;
  for (const ch of text.toLowerCase()) {
    if (/[a-z]/.test(ch)) {
      counts[ch] = (counts[ch] || 0) + 1;
      total++;
    }
  }
  const freq = {};
  for (const ch in counts) {
    freq[ch] = (counts[ch] / total) * 100;
  }
  return { freq, counts, total };
}

/**
 * Attempt to automatically detect the Caesar shift used in `text`
 * using chi-squared frequency analysis against English baseline.
 *
 * Return shape is identical to manualDecrypt() so all consumers
 * can handle both modes uniformly. Check `isManual` to distinguish.
 *
 * @param {string} text  Ciphertext to analyse
 * @returns {{
 *   shift:           number,
 *   decrypted:       string,
 *   confidence:      number,    // 0–100  (null only in manualDecrypt)
 *   isManual:        boolean,   // always false here
 *   confidenceLabel: string,
 *   candidates:      Array<{ shift: number, chi: number, decrypted: string }>,
 *   steps:           Array<{ title: string, detail: string }>,
 *   freqData:        Record<string, number>,
 *   counts:          Record<string, number>,
 *   total:           number,
 * }}
 */
export function autoDetect(text) {
  const { freq, counts, total } = getFrequency(text);

  // Guard: not enough letters for any reliable analysis
  if (total < MIN_LETTERS_FOR_DETECTION) {
    return {
      shift:           0,
      decrypted:       text,
      confidence:      0,
      isManual:        false,
      confidenceLabel: "Insufficient data",
      candidates:      [],
      steps: [
        {
          title:  "Insufficient data",
          detail: `Only ${total} alphabetic character${total !== 1 ? "s" : ""} found. ` +
                  `At least ${MIN_LETTERS_FOR_DETECTION} are needed for reliable frequency analysis.`,
        },
      ],
      freqData: freq,
      counts,
      total,
    };
  }

  // Score all 26 possible shifts, sort ascending (lowest chi = best match)
  const scores = Array.from({ length: ALPHABET_SIZE }, (_, s) => ({
    shift:     s,
    chi:       chiSquared(freq, s),
    decrypted: decrypt(text, s),
  })).sort((a, b) => a.chi - b.chi);

  const best     = scores[0];
  const runnerUp = scores[1];

  const { score: confidence, label: confidenceLabel } = computeConfidence(
    best.chi,
    runnerUp.chi,
    total
  );

  const steps = [
    {
      title:  "Letter frequency extraction",
      detail: `Analyzed ${total} alphabetic character${total !== 1 ? "s" : ""}. ` +
              `Built a per-letter frequency map for all 26 letters.`,
    },
    {
      title:  "Chi-squared scoring (all 26 shifts)",
      detail: `For each possible shift (ROT-0 through ROT-25), computed χ² statistic ` +
              `comparing the shifted distribution against English baseline frequencies.`,
    },
    {
      title:  "Shift selection",
      detail: `Best match: ROT-${best.shift} (χ²=${best.chi.toFixed(2)}). ` +
              `Runner-up: ROT-${runnerUp.shift} (χ²=${runnerUp.chi.toFixed(2)}). ` +
              `Delta: ${(runnerUp.chi - best.chi).toFixed(2)}.`,
    },
    {
      title:  "Plaintext recovery",
      detail: `Applied reverse shift of ${best.shift} position${best.shift !== 1 ? "s" : ""} ` +
              `to recover plaintext. Confidence: ${confidence}% — ${confidenceLabel}. ` +
              `(separation ratio: ${(best.chi / runnerUp.chi).toFixed(3)})`,
    },
  ];

  return {
    shift:           best.shift,
    decrypted:       best.decrypted,
    confidence,
    isManual:        false,
    confidenceLabel,
    candidates:      scores.slice(0, AUTODETECT_CANDIDATES),
    steps,
    freqData:        freq,
    counts,
    total,
  };
}

/**
 * Apply a manually specified shift to decrypt text.
 * No frequency analysis is performed.
 *
 * Returns the same shape as autoDetect() so all consumers work uniformly.
 * `confidence` is null (not 0) so existing UI guards like
 * `if (result.confidence !== null)` continue to work without changes.
 * Use `isManual === true` for explicit checks going forward.
 *
 * @param {string} text
 * @param {number} shift  Integer 0–25
 * @returns {object}  Same shape as autoDetect result
 */
export function manualDecrypt(text, shift) {
  // Explicit null-check avoids the Math.floor(0) || 0 falsy bug from original code
  const s = Math.max(
    0,
    Math.min(ALPHABET_SIZE - 1, shift != null ? Math.floor(shift) : 0)
  );
  const { freq, counts, total } = getFrequency(text);

  return {
    shift:           s,
    decrypted:       decrypt(text, s),
    confidence:      null,   // null = manual mode; keeps existing `!== null` guards working
    isManual:        true,
    confidenceLabel: "Manual mode — no frequency analysis",
    candidates:      [],
    steps: [
      {
        title:  "Manual shift applied",
        detail: `ROT-${s} was applied as specified by the user. No frequency analysis was performed.`,
      },
    ],
    freqData: freq,
    counts,
    total,
  };
}