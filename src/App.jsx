// ═══════════════════════════════════════════════════════════════
// App.jsx — Root component
//
// Responsibilities:
//   1. Owns global state: active panel, sidebar open, light theme
//   2. Instantiates hooks (useDecoder, useEncrypter, useToast)
//   3. Builds report via ReportService when decode result changes
//   4. Wires cross-panel actions (send-to-encrypter, send-to-decoder)
//   5. Renders navigation + panels
//
// RULE: App.jsx does NOT call CipherEngine or FileService directly.
//       Those are called only via hooks and services.
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";

// Engine & services
import { PANEL_IDS } from "./engine/constants.js";
import ReportService from "./services/reportService.js";
import ClipboardService from "./services/clipboardService.js";
import FileService from "./services/fileService.js";

// Hooks
import { useToast    } from "./hooks/useToast.js";
import { useDecoder  } from "./hooks/useDecoder.js";
import { useEncrypter} from "./hooks/useEncrypter.js";

// Navigation components
import { TopBar, Sidebar, SidebarFooter } from "./components/navigation/index.jsx";

// Primitive components
import { ToastContainer, ErrorBoundary } from "./components/primitives/index.jsx";

// Panels
import DecoderPanel  from "./panels/DecoderPanel.jsx";
import EncrypterPanel from "./panels/EncrypterPanel.jsx";
import AnalysisPanel  from "./panels/AnalysisPanel.jsx";
import ReportPanel    from "./panels/ReportPanel.jsx";
import HelpPanel      from "./panels/HelpPanel.jsx";

// Styles — import in your bundler, or inject via <link> in index.html
import "./styles/index.css";

export default function App() {
  // ── Navigation state ─────────────────────────────────────────
  const [panel,    setPanel]    = useState(PANEL_IDS.DECODER);
  const [sideOpen, setSideOpen] = useState(false);
  const [light,    setLight]    = useState(false);

  // ── Theme toggle ─────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  // ── Hooks ────────────────────────────────────────────────────
  const { toasts, show: toast, dismiss } = useToast();
  const dec = useDecoder(toast);
  const enc = useEncrypter(toast);

  // ── Report ───────────────────────────────────────────────────
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!dec.result) return;
    const modeLabel = dec.mode === "auto"
      ? "Auto-Detect (Frequency Analysis)"
      : `Manual (ROT-${Math.max(0, Math.min(25, parseInt(dec.manualShift) || 0))})`;
    setReport(ReportService.build(dec.result, dec.input, modeLabel));
  }, [dec.result]);

  const clearReport = useCallback(() => setReport(null), []);

  // ── Navigation ───────────────────────────────────────────────
  const navigate = useCallback((id) => {
    setPanel(id);
    setSideOpen(false);
  }, []);

  // ── Shared copy/download actions ─────────────────────────────
  const handleCopy = useCallback(async (text, label) => {
    const ok = await ClipboardService.copy(text);
    toast(ok ? `${label} copied to clipboard` : "Copy failed", ok ? "success" : "error");
  }, [toast]);

  const handleDownload = useCallback((text, filename) => {
    FileService.download(text, filename);
    toast("File downloaded", "info");
  }, [toast]);

  // ── Cross-panel actions ───────────────────────────────────────
  /** Decoder → Encrypter: send decrypted text as encrypter input */
  const sendToEncrypter = useCallback((text) => {
    enc.setInput(text);
    navigate(PANEL_IDS.ENCRYPTER);
    toast("Sent to Encrypter", "info");
  }, [enc, navigate, toast]);

  /** Encrypter → Decoder: send encrypted text as decoder input */
  const sendToDecoder = useCallback((text) => {
    dec.setInput(text);
    navigate(PANEL_IDS.DECODER);
    toast("Sent to Decoder", "info");
  }, [dec, navigate, toast]);

  // ── Analysis data ─────────────────────────────────────────────
  const analysisInput = dec.result ?? null;

  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/*
        If you're not using a CSS bundler, inject the stylesheet:
        <style>{require("./styles/index.css")}</style>
        or import it at the top of this file with your bundler.
      */}

      <div className="shell">

        {/* ── Top bar ── */}
        <TopBar
          sideOpen={sideOpen}
          onToggleSide={() => setSideOpen(o => !o)}
          lastResult={dec.result}
          lightTheme={light}
          onToggleTheme={() => setLight(l => !l)}
        />

        <div className="body">

          {/* ── Sidebar ── */}
          <Sidebar
            activePanel={panel}
            onNavigate={navigate}
            open={sideOpen}
            hasReport={!!report}
            onClose={() => setSideOpen(false)}
          />

          {/* ── Main content ── */}
          <main className="main">

            {/* Each panel is rendered but hidden unless active.
                ErrorBoundary prevents one panel crash from killing the app. */}

            <div className={`panel${panel === PANEL_IDS.DECODER   ? " active" : ""}`}>
              <ErrorBoundary>
                <DecoderPanel
                  dec={dec}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  onNavigate={navigate}
                  onSendToEncrypter={sendToEncrypter}
                />
              </ErrorBoundary>
            </div>

            <div className={`panel${panel === PANEL_IDS.ENCRYPTER ? " active" : ""}`}>
              <ErrorBoundary>
                <EncrypterPanel
                  enc={enc}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  onSendToDecoder={sendToDecoder}
                />
              </ErrorBoundary>
            </div>

            <div className={`panel${panel === PANEL_IDS.ANALYSIS  ? " active" : ""}`}>
              <ErrorBoundary>
                <AnalysisPanel
                  decResult={analysisInput}
                  onCopy={handleCopy}
                  showToast={toast}
                />
              </ErrorBoundary>
            </div>

            <div className={`panel${panel === PANEL_IDS.REPORT    ? " active" : ""}`}>
              <ErrorBoundary>
                <ReportPanel
                  report={report}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  onNavigate={navigate}
                  onClear={clearReport}
                />
              </ErrorBoundary>
            </div>

            <div className={`panel${panel === PANEL_IDS.HELP      ? " active" : ""}`}>
              <ErrorBoundary>
                <HelpPanel />
              </ErrorBoundary>
            </div>

          </main>
        </div>
      </div>

      {/* ── Toast notifications ── */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}