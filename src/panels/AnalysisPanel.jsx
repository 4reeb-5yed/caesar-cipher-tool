// ═══════════════════════════════════════════════════════════════
// panels/AnalysisPanel.jsx
// Frequency analysis dashboard. No engine/service calls directly.
//
// NOTE: AnalysisPanel receives pre-computed decResult from App.
// The ONLY engine call here is for custom text analysis, which
// is acceptable since AnalysisPanel owns that local feature.
// For strict purity, this could also be moved to a useAnalysis hook.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { getFrequency } from "../engine/cipherEngine.js";
import FileService from "../services/fileService.js";
import {
  Button, ButtonGroup, Card, NoteBox, SectionHead, StatCard,
} from "../components/primitives/index.jsx";
import { FreqBarChart, ChiChart, ConfRing } from "../components/charts/index.jsx";

/**
 * @param {object}       props
 * @param {object|null}  props.decResult   From useDecoder result (or null)
 * @param {Function}     props.onCopy      (text, label) => void
 * @param {Function}     props.showToast   (msg, type) => void
 */
export default function AnalysisPanel({ decResult, onCopy, showToast }) {
  const [customText, setCustomText] = useState("");
  const [customFreq, setCustomFreq] = useState(null);

  // Derive from decode result
  const cipherFreq    = decResult?.freqData     ?? null;
  const decryptedFreq = decResult
    ? getFrequency(decResult.decrypted ?? "").freq
    : null;

  const analyzeCustom = () => {
    if (!customText.trim()) return;
    setCustomFreq(getFrequency(customText).freq);
  };

  const clearCustom = () => {
    setCustomFreq(null);
    setCustomText("");
  };

  // NEW: Export frequency as CSV
  const exportCSV = (freqMap, label) => {
    try {
      FileService.downloadCSV(freqMap, `frequency_${label}.csv`);
      showToast?.("CSV exported", "success");
    } catch (err) {
      showToast?.("Export failed: " + err.message, "error");
    }
  };

  return (
    <>
      <div>
        <p className="page-title">Frequency Analysis</p>
        <p className="page-sub">Visual letter frequency dashboard with English baseline comparison</p>
      </div>

      {decResult ? (
        <>
          {/* Summary stats */}
          <div className="grid3">
            <StatCard
              label="Detected Shift"
              value={`ROT-${decResult.shift}`}
              valueColor="var(--accent)"
            />

            {decResult.confidence !== null && decResult.confidence !== undefined && (
              <div className="stat-card">
                <span className="stat-label">Confidence</span>
                <div className="conf-ring-wrap" style={{ marginTop: 6 }}>
                  <ConfRing value={decResult.confidence} size={70} />
                  <div className="conf-ring-text">
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>
                      {decResult.confidence > 70
                        ? "High — reliable"
                        : decResult.confidence > 40
                        ? "Medium — check candidates"
                        : "Low — short text?"}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>chi-squared match</span>
                  </div>
                </div>
              </div>
            )}

            <StatCard label="Letters" value={decResult.total ?? "—"} sub="analyzed" />
          </div>

          {/* Main frequency chart */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <SectionHead>Letter Frequency — Cipher vs Decrypted vs English</SectionHead>
              {/* NEW: Export CSV button */}
              <ButtonGroup>
                {decryptedFreq && (
                  <Button size="xs" icon="ti-file-spreadsheet" onClick={() => exportCSV(decryptedFreq, "decrypted")}>
                    Export CSV
                  </Button>
                )}
                {cipherFreq && (
                  <Button size="xs" icon="ti-copy" onClick={() => onCopy(
                    Object.entries(cipherFreq).sort().map(([l, f]) => `${l.toUpperCase()}: ${f.toFixed(2)}%`).join("\n"),
                    "Frequency table"
                  )}>
                    Copy Table
                  </Button>
                )}
              </ButtonGroup>
            </div>
            <FreqBarChart textFreq={decryptedFreq} cipherFreq={cipherFreq} height={240} />
          </Card>

          {/* Chi-squared candidates chart */}
          {decResult.candidates?.length > 0 && (
            <Card>
              <SectionHead>All {decResult.candidates.length} Best Shifts — χ² Score (lower = better match)</SectionHead>
              <ChiChart candidates={decResult.candidates} />
              <div style={{ marginTop: 12, fontSize: 11, color: "var(--text3)" }}>
                Wider bar = lower χ² = better fit with English frequency distribution.
              </div>
            </Card>
          )}
        </>
      ) : (
        <NoteBox icon="ti-info-circle">
          Decode a ciphertext first to see the full analysis dashboard, or enter custom text below.
        </NoteBox>
      )}

      {/* Custom text analysis */}
      <Card>
        <SectionHead>Analyze Custom Text</SectionHead>
        <textarea
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="Paste any text to analyze its letter frequency distribution…"
          rows={4}
        />
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="primary" size="sm" icon="ti-chart-bar" onClick={analyzeCustom} disabled={!customText.trim()}>
            Analyze
          </Button>
          {customFreq && (
            <>
              {/* NEW: Export custom CSV */}
              <Button size="sm" icon="ti-file-spreadsheet" onClick={() => exportCSV(customFreq, "custom")}>
                Export CSV
              </Button>
              <Button size="sm" icon="ti-copy" onClick={() => onCopy(
                Object.entries(customFreq).sort().map(([l, f]) => `${l.toUpperCase()}: ${f.toFixed(2)}%`).join("\n"),
                "Custom frequency table"
              )}>
                Copy Table
              </Button>
              <Button size="sm" variant="ghost" onClick={clearCustom}>
                <i className="ti ti-x" /> Clear
              </Button>
            </>
          )}
        </div>
        {customFreq && (
          <div style={{ marginTop: 16 }}>
            <FreqBarChart textFreq={customFreq} height={200} />
          </div>
        )}
      </Card>

      <NoteBox icon="ti-bulb">
        In English, the top 5 letters by frequency are E (12.7%), T (9.1%), A (8.2%), O (7.5%), and I (7.0%).
        A Caesar cipher preserves these relative frequencies — just shifted. Finding which cipher letter maps to E gives you the shift.
      </NoteBox>
    </>
  );
}