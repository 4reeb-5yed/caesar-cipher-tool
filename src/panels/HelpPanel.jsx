// ═══════════════════════════════════════════════════════════════
// panels/HelpPanel.jsx
// Static help & reference content. No state. No hooks. No engine.
// ═══════════════════════════════════════════════════════════════

export default function HelpPanel() {
  return (
    <>
      <div>
        <p className="page-title">Help &amp; Reference</p>
        <p className="page-sub">Everything about Caesar ciphers and how this tool works</p>
      </div>

      <div className="card help-article">
        <p className="help-h2">What is a Caesar Cipher?</p>
        <p className="help-p">
          Named after Julius Caesar, the Caesar cipher is one of the oldest known encryption techniques.
          Each letter in the plaintext is shifted a fixed number of positions along the alphabet.
          With a shift of 3, <code className="help-code">A</code> → <code className="help-code">D</code>,{" "}
          <code className="help-code">B</code> → <code className="help-code">E</code>, and so on.
          Non-alphabetic characters (numbers, punctuation, spaces) are passed through unchanged.
        </p>

        <div className="help-sep" />

        <p className="help-h2">How Auto-Detection Works</p>

        <p className="help-h3">1. Frequency Extraction</p>
        <p className="help-p">
          The tool counts how often each letter appears in the ciphertext and converts these counts
          to percentages, building a frequency map across all 26 letters.
        </p>

        <p className="help-h3">2. Chi-Squared Scoring</p>
        <p className="help-p">
          For each of the 26 possible shifts, the tool computes a chi-squared (χ²) statistic — a
          measure of how closely the observed distribution matches expected English frequencies.
          Lower χ² = better match.
        </p>

        <p className="help-h3">3. Shift Selection &amp; Confidence</p>
        <p className="help-p">
          The shift with the lowest χ² score is selected. Confidence is derived from how much better
          the best shift is compared to the worst candidate — high confidence means the text strongly
          resembles English at that shift.
        </p>

        <div className="help-sep" />

        <p className="help-h2">Keyboard Shortcuts</p>
        <p className="help-p">
          <code className="help-code">Ctrl + Enter</code> — Run decode or encrypt from the active input area.
        </p>

        <div className="help-sep" />

        <p className="help-h2">Dashboard Panels</p>

        <p className="help-h3">Decoder</p>
        <p className="help-p">
          Paste or upload ciphertext. Use Auto-Detect for unknown shifts or Manual Shift if you know
          the key. Results include the <strong>full</strong> decrypted text (scrollable), confidence,
          candidate shifts, and a step-by-step breakdown. Use <em>→ Encrypter</em> to send output
          directly to the Encrypter panel.
        </p>

        <p className="help-h3">Encrypter</p>
        <p className="help-p">
          Apply any shift (ROT-0 through ROT-25) to plaintext. The shift map preview shows every
          letter mapping before you encrypt. Use <em>→ Decoder</em> to send the ciphertext back for
          round-trip verification.
        </p>

        <p className="help-h3">Frequency Analysis</p>
        <p className="help-p">
          Grouped bar chart comparing cipher text, decrypted text, and English baseline frequencies
          side by side. The chi-squared chart ranks all candidate shifts visually. Frequency tables
          can be exported as CSV or copied to clipboard.
        </p>

        <p className="help-h3">Report</p>
        <p className="help-p">
          After decoding, a structured report is generated with input statistics, all candidates,
          step reasoning, a frequency chart, and the <strong>complete</strong> decrypted output
          (no truncation). The report can be copied as plain text or downloaded as a <code className="help-code">.txt</code> file.
        </p>

        <div className="help-sep" />

        <p className="help-h2">Limitations</p>
        <p className="help-p">
          Frequency analysis is most reliable on texts with 50+ letters. Short messages or
          non-English texts may produce low confidence or incorrect auto-detection — in those
          cases, inspect the top candidates table or use manual shift mode.
        </p>
        <p className="help-p">
          The Caesar cipher provides <strong>no real security</strong>. It is broken in milliseconds
          by any computer. Use this tool for education, puzzles, or historical study only.
        </p>
      </div>
    </>
  );
}