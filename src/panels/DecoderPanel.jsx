// ═══════════════════════════════════════════════════════════════
// panels/DecoderPanel.jsx
// Decoder UI. Consumes useDecoder hook. No engine/service calls.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import {
  Button, ButtonGroup, Card, CardHeader, NoteBox,
  ResultBox, SectionHead, StepList, StatCard, Tabs,
} from "../components/primitives/index.jsx";
import { ChiChart } from "../components/charts/index.jsx";
import { SHIFT_MIN, SHIFT_MAX } from "../engine/constants.js";

const MODE_TABS = [
  { id: "auto",   label: "Auto-Detect",  icon: "ti-cpu"     },
  { id: "manual", label: "Manual Shift", icon: "ti-sliders"  },
];

/**
 * @param {object}   props
 * @param {object}   props.dec          From useDecoder hook
 * @param {Function} props.onCopy       (text, label) => void
 * @param {Function} props.onDownload   (text, filename) => void
 * @param {Function} props.onNavigate   (panelId) => void
 * @param {Function} props.onSendToEncrypter  (text) => void  — new cross-panel action
 */
export default function DecoderPanel({ dec, onCopy, onDownload, onNavigate, onSendToEncrypter }) {
  const {
    mode, setMode, input, setInput,
    manualShift, setManualShift, result, busy,
    decode, reset, loadFile, dropFile, fileRef,
  } = dec;

  const [dragover, setDragover] = useState(false);

  const clampedShift = Math.max(SHIFT_MIN, Math.min(SHIFT_MAX, parseInt(manualShift) || 0));

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await dropFile(file);
  };

  return (
    <>
      {/* ── Page header ── */}
      <div>
        <p className="page-title">Cipher Decoder</p>
        <p className="page-sub">Auto-detect or manual shift decryption with frequency analysis</p>
      </div>

      {/* ── Mode selector ── */}
      <Card small>
        <span className="label">Detection mode</span>
        <Tabs items={MODE_TABS} active={mode} onChange={setMode} maxWidth={340} />
        {mode === "manual" && (
          <div className="input-row" style={{ marginTop: 12 }}>
            <div>
              <span className="label">Shift (ROT-n)</span>
              <input
                type="number" min={SHIFT_MIN} max={SHIFT_MAX} value={manualShift}
                onChange={e => setManualShift(Math.max(SHIFT_MIN, Math.min(SHIFT_MAX, +e.target.value || 0)))}
              />
            </div>
            <div style={{ paddingTop: 18, color: "var(--text2)", fontSize: 13 }}>
              → ROT-{clampedShift} will be applied
            </div>
          </div>
        )}
      </Card>

      {/* ── Input card ── */}
      <Card>
        <CardHeader title="Ciphertext Input">
          <ButtonGroup>
            {/* Upload button */}
            <div
              className={`file-drop${dragover ? " dragover" : ""}`}
              style={{ padding: "6px 12px", cursor: "pointer" }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={handleDrop}
            >
              <i className="ti ti-upload" />
              <span style={{ fontSize: 12 }}>Upload .txt</span>
              <input type="file" accept=".txt,text/plain" ref={fileRef} onChange={loadFile} style={{ display: "none" }} />
            </div>

            {/* Clear / Reset button — NEW */}
            {(input || result) && (
              <Button variant="danger" size="sm" icon="ti-trash" onClick={reset}>
                Reset
              </Button>
            )}
          </ButtonGroup>
        </CardHeader>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste ciphertext here, or drag-and-drop a .txt file…"
          rows={6}
          onKeyDown={e => { if (e.ctrlKey && e.key === "Enter") decode(); }}
        />

        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>
            {input.length.toLocaleString()} chars · Ctrl+Enter to decode
          </span>
          <Button variant="primary" icon="ti-lock-open" busy={busy} busyLabel="Analyzing…" onClick={decode} disabled={!input.trim()}>
            Decode
          </Button>
        </div>
      </Card>

      {/* ── Result section ── */}
      {result && (
        <>
          {/* Stats row */}
          <div className="grid4">
            <StatCard
              label="Detected Shift"
              value={`ROT-${result.shift}`}
              sub="Caesar shift key"
              valueColor="var(--accent)"
            />
            {result.confidence !== null && result.confidence !== undefined && (
              <StatCard
                label="Confidence"
                value={`${result.confidence}%`}
                sub={result.confidence > 70 ? "High match" : result.confidence > 40 ? "Medium match" : "Low match"}
                valueColor={result.confidence > 70 ? "var(--green)" : result.confidence > 40 ? "var(--amber)" : "var(--red)"}
              />
            )}
            <StatCard label="Letters Analyzed" value={result.total ?? "—"} sub="alphabetic chars" />
            <StatCard label="Candidates Tested" value={result.candidates?.length ?? 0} sub="shifts evaluated" />
          </div>

          {/* Decrypted output — NO truncation */}
          <Card>
            <CardHeader title={`Decrypted Output — ROT-${result.shift}`}>
              <ButtonGroup>
                <Button size="sm" icon="ti-copy" onClick={() => onCopy(result.decrypted, "Decrypted text")}>
                  Copy
                </Button>
                <Button size="sm" icon="ti-download" onClick={() => onDownload(result.decrypted, "decrypted.txt")}>
                  Save .txt
                </Button>
                {/* NEW: navigate to analysis */}
                <Button size="sm" icon="ti-chart-bar" onClick={() => onNavigate("analysis")}>
                  Analyze
                </Button>
                {/* NEW: navigate to report */}
                <Button size="sm" icon="ti-file-description" onClick={() => onNavigate("report")}>
                  Report
                </Button>
                {/* NEW: send to encrypter */}
                {onSendToEncrypter && (
                  <Button size="sm" icon="ti-lock" onClick={() => onSendToEncrypter(result.decrypted)}>
                    → Encrypter
                  </Button>
                )}
              </ButtonGroup>
            </CardHeader>

            {/* ResultBox uses CSS scroll — zero JS truncation */}
            <ResultBox>{result.decrypted}</ResultBox>

            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
              {result.decrypted.length.toLocaleString()} chars output
              {result.decrypted.length > 400 && " · scroll to see full text"}
            </div>
          </Card>

          {/* Candidates + Steps */}
          {result.candidates?.length > 0 && (
            <div className="grid2">
              <Card>
                <SectionHead>Top Shift Candidates</SectionHead>
                <ChiChart candidates={result.candidates} />
              </Card>
              <Card>
                <SectionHead>Analysis Steps</SectionHead>
                <StepList steps={result.steps} />
              </Card>
            </div>
          )}

          <NoteBox icon="ti-bulb">
            Frequency analysis compares letter distribution in the ciphertext against English baselines
            (E=12.7%, T=9.1%, A=8.2%…). The shift with the lowest χ² score is most likely correct.
            For texts under 40 letters, inspect the top candidates manually.
          </NoteBox>
        </>
      )}
    </>
  );
}