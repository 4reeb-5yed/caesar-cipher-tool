// ═══════════════════════════════════════════════════════════════
// panels/ReportPanel.jsx
// Analysis report view. Uses decryptedFull — NEVER truncated.
//
// FIXES from v1:
//   1. decryptedPreview → decryptedFull  (no 300-char slice)
//   2. Added "Download .txt" button
//   3. Added "Clear Report" button
//   4. ResultBox shows full text; CSS handles scroll
// ═══════════════════════════════════════════════════════════════

import ReportService from "../services/reportService.js";
import {
  Button, ButtonGroup, Card, CardHeader, EmptyState,
  ResultBox, SectionHead, StepList,
} from "../components/primitives/index.jsx";
import { FreqBarChart, ChiChart } from "../components/charts/index.jsx";

/**
 * @param {object}        props
 * @param {object|null}   props.report       ReportData from ReportService.build()
 * @param {Function}      props.onCopy       (text, label) => void
 * @param {Function}      props.onDownload   (text, filename) => void
 * @param {Function}      props.onNavigate   (panelId) => void
 * @param {Function}      props.onClear      () => void  — clears the report
 */
export default function ReportPanel({ report, onCopy, onDownload, onNavigate, onClear }) {
  if (!report) {
    return (
      <>
        <div>
          <p className="page-title">Analysis Report</p>
          <p className="page-sub">Detailed breakdown of the last decode operation</p>
        </div>
        <Card>
          <EmptyState icon="ti-file-description" message="No report yet. Run a decode operation to generate one.">
            <Button variant="primary" size="sm" icon="ti-lock-open" style={{ marginTop: 8 }} onClick={() => onNavigate("decoder")}>
              Go to Decoder
            </Button>
          </EmptyState>
        </Card>
      </>
    );
  }

  const reportText = ReportService.toText(report);

  return (
    <>
      <div>
        <p className="page-title">Analysis Report</p>
        <p className="page-sub">Generated {report.timestamp}</p>
      </div>

      {/* Action bar */}
      <ButtonGroup>
        <Button icon="ti-copy" size="sm" onClick={() => onCopy(reportText, "Report")}>
          Copy Report
        </Button>
        {/* NEW: Download report as .txt */}
        <Button icon="ti-download" size="sm" onClick={() => onDownload(reportText, "caesar_report.txt")}>
          Download .txt
        </Button>
        {/* NEW: Clear report */}
        <Button icon="ti-trash" size="sm" variant="danger" onClick={onClear}>
          Clear Report
        </Button>
      </ButtonGroup>

      {/* Input stats + detection results */}
      <div className="report-grid">
        <Card>
          <SectionHead>Input Statistics</SectionHead>
          {[
            ["Mode",       report.mode],
            ["Characters", report.inputLength.toLocaleString()],
            ["Words",      report.wordCount.toLocaleString()],
            ["Letters",    report.letterCount.toLocaleString()],
          ].map(([k, v]) => (
            <div className="report-row" key={k}>
              <span className="report-key">{k}</span>
              <span className="report-val">{v}</span>
            </div>
          ))}
        </Card>

        <Card>
          <SectionHead>Detection Results</SectionHead>
          <div className="report-row">
            <span className="report-key">Detected shift</span>
            <span className="report-val" style={{ color: "var(--accent)", fontSize: 18 }}>ROT-{report.shift}</span>
          </div>
          {report.confidence !== null && (
            <div className="report-row">
              <span className="report-key">Confidence</span>
              <span className="report-val">
                <span className={`badge ${report.confidence > 70 ? "badge-green" : report.confidence > 40 ? "badge-amber" : "badge-red"}`}>
                  {report.confidence}%
                </span>
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* Chi-squared chart */}
      {report.candidates?.length > 0 && (
        <Card>
          <SectionHead>Top Shift Candidates — χ² Score</SectionHead>
          <ChiChart candidates={report.candidates} />
        </Card>
      )}

      {/* Frequency chart */}
      {report.freqData && Object.keys(report.freqData).length > 0 && (
        <Card>
          <SectionHead>Decrypted Text — Letter Frequency vs English</SectionHead>
          <FreqBarChart textFreq={report.freqData} height={200} />
        </Card>
      )}

      {/* Analysis steps */}
      {report.steps?.length > 0 && (
        <Card>
          <SectionHead>Analysis Steps</SectionHead>
          <StepList steps={report.steps} />
        </Card>
      )}

      {/* ─────────────────────────────────────────────────────────
          FIX: Full decrypted text — no .slice(0, 300), no "…"
          decryptedFull is the complete string from reportService.
          ResultBox handles display via CSS scrolling.
          ───────────────────────────────────────────────────────── */}
      {report.decryptedFull && (
        <Card>
          <CardHeader title="Decrypted Output (Full)">
            <ButtonGroup>
              <Button size="sm" icon="ti-copy" onClick={() => onCopy(report.decryptedFull, "Decrypted output")}>
                Copy
              </Button>
              <Button size="sm" icon="ti-download" onClick={() => onDownload(report.decryptedFull, "decrypted_output.txt")}>
                Download
              </Button>
            </ButtonGroup>
          </CardHeader>

          {/* FULL TEXT — ResultBox scrolls, nothing is cut off */}
          <ResultBox>{report.decryptedFull}</ResultBox>

          <div style={{ marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
            {report.decryptedFull.length.toLocaleString()} chars total
            {report.decryptedFull.length > 400 && " · scroll to read full output"}
          </div>
        </Card>
      )}
    </>
  );
}