// ═══════════════════════════════════════════════════════════════
// services/reportService.js
// Build and serialize analysis reports.
//
// ARCHITECTURAL RULES:
//   - Does NOT import CipherEngine. All frequency data is passed in.
//   - Does NOT import React.
//   - NO truncation of decrypted text. Ever.
// ═══════════════════════════════════════════════════════════════

const ReportService = {
  /**
   * Build a structured report object from a decode result.
   *
   * @param {object} decodeResult   Output from CipherEngine.autoDetect or manualDecrypt
   * @param {string} inputText      Original ciphertext (untrimmed)
   * @param {string} modeLabel      Human-readable mode string
   * @returns {ReportData}
   */
  build(decodeResult, inputText, modeLabel) {
    const words  = inputText.trim().split(/\s+/).filter(Boolean).length;

    return {
      timestamp:      new Date().toLocaleString(),
      mode:           modeLabel,
      inputLength:    inputText.length,
      wordCount:      words,
      letterCount:    decodeResult.total ?? 0,
      shift:          decodeResult.shift,
      confidence:     decodeResult.confidence ?? null,
      candidates:     decodeResult.candidates ?? [],
      steps:          decodeResult.steps ?? [],
      freqData:       decodeResult.freqData ?? {},
      // ─────────────────────────────────────────────────────────
      // FIX: Store the FULL decrypted text. Zero truncation.
      // The UI layer (ResultBox) handles display via CSS scrolling.
      // ─────────────────────────────────────────────────────────
      decryptedFull:  decodeResult.decrypted ?? "",
    };
  },

  /**
   * Serialize a report object to a plain-text string.
   * The FULL decrypted text is always included — no truncation.
   *
   * @param {ReportData} r
   * @returns {string}
   */
  toText(r) {
    const line    = "─".repeat(52);
    const subline = "·".repeat(52);

    const candidateLines = r.candidates.length > 0
      ? r.candidates.map((c, i) =>
          `  ${i === 0 ? "★" : `${i + 1}.`} ROT-${String(c.shift).padStart(2, "0")}  χ²=${c.chi.toFixed(4)}`
        )
      : ["  (no candidates — manual mode)"];

    const stepLines = r.steps.length > 0
      ? r.steps.flatMap((s, i) => [
          `  ${i + 1}. ${s.title}`,
          `     ${s.detail}`,
        ])
      : ["  (no analysis steps)"];

    return [
      "CAESAR CIPHER — ANALYSIS REPORT",
      line,
      `Generated : ${r.timestamp}`,
      `Mode      : ${r.mode}`,
      "",
      "INPUT STATISTICS",
      subline,
      `  Characters : ${r.inputLength}`,
      `  Words      : ${r.wordCount}`,
      `  Letters    : ${r.letterCount}`,
      "",
      "DETECTION RESULTS",
      subline,
      `  Detected shift : ROT-${r.shift}`,
      r.confidence !== null
        ? `  Confidence     : ${r.confidence}%`
        : "  Confidence     : N/A (manual mode)",
      "",
      "TOP SHIFT CANDIDATES (χ² score — lower is better)",
      subline,
      ...candidateLines,
      "",
      "ANALYSIS STEPS",
      subline,
      ...stepLines,
      "",
      "DECRYPTED OUTPUT",
      line,
      // FIX: Full text — no .slice(), no "…" suffix, no 300-char limit
      r.decryptedFull,
      line,
    ]
      .join("\n");
  },
};

export default ReportService;

/**
 * @typedef {object} ReportData
 * @property {string}   timestamp
 * @property {string}   mode
 * @property {number}   inputLength
 * @property {number}   wordCount
 * @property {number}   letterCount
 * @property {number}   shift
 * @property {number|null} confidence
 * @property {Array}    candidates
 * @property {Array}    steps
 * @property {object}   freqData
 * @property {string}   decryptedFull   — FULL text, never truncated
 */