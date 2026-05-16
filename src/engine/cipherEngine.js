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

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Shift a single alphabetic character by `shift` positions.
 * Preserves case. Non-alpha characters must not be passed here.
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
 * Lower chi-squared = text distribution more closely matches English
 * under that shift assumption.
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
 * @param {string} text  Ciphertext to analyze
 * @returns {{
 *   shift: number,
 *   decrypted: string,
 *   confidence: number,        // 0–100
 *   candidates: Array<{shift:number, chi:number, decrypted:string}>,
 *   steps: Array<{title:string, detail:string}>,
 *   freqData: Record<string,number>,
 *   counts: Record<string,number>,
 *   total: number,
 * }}
 */
export function autoDetect(text) {
  const { freq, counts, total } = getFrequency(text);

  // Not enough data for reliable analysis
  if (total < MIN_LETTERS_FOR_DETECTION) {
    return {
      shift: 0,
      decrypted: text,
      confidence: 0,
      candidates: [],
      steps: [],
      freqData: freq,
      counts,
      total,
    };
  }

  // Score all 26 possible shifts
  const scores = Array.from({ length: ALPHABET_SIZE }, (_, s) => ({
    shift: s,
    chi: chiSquared(freq, s),
    decrypted: decrypt(text, s),
  })).sort((a, b) => a.chi - b.chi);

  const best = scores[0];
  const worstChi = scores[ALPHABET_SIZE - 1].chi;

  // Confidence: how much better is the best vs worst candidate
  const confidence = Math.min(
    100,
    Math.round(((worstChi - best.chi) / (worstChi + 1)) * 100)
  );

  const steps = [
    {
      title: "Letter frequency extraction",
      detail: `Analyzed ${total} alphabetic character${total !== 1 ? "s" : ""}. Built a per-letter frequency map for all 26 letters.`,
    },
    {
      title: "Chi-squared scoring (all 26 shifts)",
      detail: `For each possible shift (ROT-0 through ROT-25), computed χ² statistic comparing the shifted distribution against English baseline frequencies.`,
    },
    {
      title: "Shift selection",
      detail: `Best match: ROT-${best.shift} (χ²=${best.chi.toFixed(2)}). Runner-up: ROT-${scores[1].shift} (χ²=${scores[1].chi.toFixed(2)}). Delta: ${(scores[1].chi - best.chi).toFixed(2)}.`,
    },
    {
      title: "Plaintext recovery",
      detail: `Applied reverse shift of ${best.shift} position${best.shift !== 1 ? "s" : ""} to recover plaintext. Confidence score: ${confidence}% (derived from spread between best and worst χ² values).`,
    },
  ];

  return {
    shift: best.shift,
    decrypted: best.decrypted,
    confidence,
    candidates: scores.slice(0, AUTODETECT_CANDIDATES),
    steps,
    freqData: freq,
    counts,
    total,
  };
}

/**
 * Apply a manual (known) shift to decrypt text.
 * Returns the same shape as autoDetect for uniform consumption.
 *
 * @param {string} text
 * @param {number} shift  Integer 0–25
 * @returns {object}  Same shape as autoDetect result
 */
export function manualDecrypt(text, shift) {
  const s = Math.max(0, Math.min(ALPHABET_SIZE - 1, Math.floor(shift) || 0));
  const { freq, counts, total } = getFrequency(text);
  return {
    shift: s,
    decrypted: decrypt(text, s),
    confidence: null,
    candidates: [],
    steps: [
      {
        title: "Manual shift applied",
        detail: `ROT-${s} was applied as specified by the user. No frequency analysis was performed.`,
      },
    ],
    freqData: freq,
    counts,
    total,
  };
}