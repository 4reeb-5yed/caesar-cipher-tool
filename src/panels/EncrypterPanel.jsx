// ═══════════════════════════════════════════════════════════════
// panels/EncrypterPanel.jsx
// Encrypter UI. Consumes useEncrypter hook. No engine/service calls.
//
// BUG FIXED: local variable `enc` (line 874 in v1) shadowed the
// `enc` prop. Renamed to `encryptedChar` to avoid collision.
// ═══════════════════════════════════════════════════════════════

import {
  Button, ButtonGroup, Card, CardHeader, ResultBox,
} from "../components/primitives/index.jsx";
import { SHIFT_MIN, SHIFT_MAX, ALPHABET } from "../engine/constants.js";

/**
 * @param {object}   props
 * @param {object}   props.enc             From useEncrypter hook
 * @param {Function} props.onCopy          (text, label) => void
 * @param {Function} props.onDownload      (text, filename) => void
 * @param {Function} props.onSendToDecoder (text) => void  — cross-panel action
 */
export default function EncrypterPanel({ enc, onCopy, onDownload, onSendToDecoder }) {
  const { input, setInput, shift, setShift, result, busy, runEncrypt, reset, loadFile, fileRef } = enc;
  const clampedShift = Math.max(SHIFT_MIN, Math.min(SHIFT_MAX, parseInt(shift) || 0));
  const reverseShift = (26 - clampedShift) % 26;

  return (
    <>
      {/* ── Page header ── */}
      <div>
        <p className="page-title">Cipher Encrypter</p>
        <p className="page-sub">Apply a Caesar shift to plaintext with live mapping preview</p>
      </div>

      {/* ── Input card ── */}
      <Card>
        <CardHeader title="Plaintext Input">
          <ButtonGroup>
            <Button size="sm" icon="ti-upload" onClick={() => fileRef.current?.click()}>
              Upload .txt
              <input type="file" accept=".txt" ref={fileRef} onChange={loadFile} style={{ display: "none" }} />
            </Button>

            {/* NEW: Clear button */}
            {(input || result) && (
              <Button size="sm" variant="danger" icon="ti-trash" onClick={reset}>
                Clear
              </Button>
            )}
          </ButtonGroup>
        </CardHeader>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste plaintext to encrypt…"
          rows={6}
          onKeyDown={e => { if (e.ctrlKey && e.key === "Enter") runEncrypt(); }}
        />

        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <span className="label">Shift (ROT-n)</span>
            <input
              type="number" min={SHIFT_MIN} max={SHIFT_MAX} value={shift}
              onChange={e => setShift(Math.max(SHIFT_MIN, Math.min(SHIFT_MAX, +e.target.value || 0)))}
              style={{ width: 80 }}
            />
          </div>
          <div style={{ paddingTop: 18 }}>
            <Button
              variant="primary" icon="ti-lock"
              busy={busy} busyLabel="Working…"
              onClick={runEncrypt} disabled={!input.trim()}
            >
              Encrypt
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
          {input.length.toLocaleString()} chars · Ctrl+Enter to encrypt
        </div>
      </Card>

      {/* ── Shift map preview (live, no encrypt needed) ── */}
      <Card>
        <p className="section-head">Shift Map — ROT-{clampedShift}</p>
        <div className="alpha-map">
          {ALPHABET.split("").map(c => {
            // FIX: renamed from `enc` to `encryptedChar` to avoid prop shadowing
            const encryptedChar = String.fromCharCode(((c.charCodeAt(0) - 65 + clampedShift) % 26) + 65);
            return (
              <div className="alpha-cell" key={c}>
                <span className="alpha-plain">{c}</span>
                <span className="alpha-enc">{encryptedChar}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>Blue</span> = plaintext ·{" "}
          <span style={{ color: "var(--text2)" }}>Grey</span> = ciphertext
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: "var(--text3)" }}>
          To reverse: use ROT-{reverseShift} in the Decoder
        </div>
      </Card>

      {/* ── Encrypted result ── */}
      {result && (
        <Card>
          <CardHeader title={`Encrypted Output — ROT-${clampedShift}`}>
            <ButtonGroup>
              <Button size="sm" icon="ti-copy" onClick={() => onCopy(result, "Ciphertext")}>
                Copy
              </Button>
              <Button size="sm" icon="ti-download" onClick={() => onDownload(result, `encrypted_rot${clampedShift}.txt`)}>
                Save .txt
              </Button>
              {/* NEW: send back to decoder */}
              {onSendToDecoder && (
                <Button size="sm" icon="ti-lock-open" onClick={() => onSendToDecoder(result)}>
                  → Decoder
                </Button>
              )}
            </ButtonGroup>
          </CardHeader>

          {/* Full output — no truncation */}
          <ResultBox>{result}</ResultBox>

          <div style={{ marginTop: 10, fontSize: 11, color: "var(--text3)" }}>
            {result.length.toLocaleString()} chars ·{" "}
            To decrypt, use ROT-{reverseShift} in the Decoder
            {result.length > 400 && " · scroll to see full text"}
          </div>
        </Card>
      )}
    </>
  );
}