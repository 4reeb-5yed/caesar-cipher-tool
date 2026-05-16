// ═══════════════════════════════════════════════════════════════
// hooks/useDecoder.js
// All state and actions for the Decoder panel.
//
// RULES:
//   - Calls CipherEngine + FileService. Never calls UI components.
//   - Panels consume this hook and render results — never call engine.
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback } from "react";
import { autoDetect, manualDecrypt } from "../engine/cipherEngine.js";
import { SHIFT_DEFAULT_DECRYPT, DECODE_DEBOUNCE_MS } from "../engine/constants.js";
import FileService from "../services/fileService.js";

/**
 * @returns {DecoderState}
 */
export function useDecoder(showToast) {
  const [mode,        setMode]        = useState("auto");
  const [input,       setInput]       = useState("");
  const [manualShift, setManualShift] = useState(SHIFT_DEFAULT_DECRYPT);
  const [result,      setResult]      = useState(null);
  const [busy,        setBusy]        = useState(false);
  const fileRef = useRef(null);

  /** Run the decode operation. */
  const decode = useCallback(() => {
    const text = input.trim();
    if (!text) {
      showToast("Enter ciphertext to decode", "error");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      try {
        const res = mode === "auto"
          ? autoDetect(text)
          : manualDecrypt(text, manualShift);
        setResult(res);
        showToast("Decoded successfully", "success");
      } catch (err) {
        showToast("Decode error: " + err.message, "error");
      } finally {
        setBusy(false);
      }
    }, DECODE_DEBOUNCE_MS);
  }, [input, mode, manualShift, showToast]);

  /** Clear input and reset result. */
  const reset = useCallback(() => {
    setInput("");
    setResult(null);
  }, []);

  /** Load text from a file upload event. */
  const loadFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await FileService.read(file);
      setInput(text);
      showToast(`Loaded: ${file.name}`, "info");
    } catch (err) {
      showToast(err.message, "error");
    }
    // Reset input so re-uploading the same file fires onChange
    if (e.target) e.target.value = "";
  }, [showToast]);

  /** Handle drag-and-drop file. */
  const dropFile = useCallback(async (file) => {
    if (!file) return;
    try {
      const text = await FileService.read(file);
      setInput(text);
      showToast(`Loaded: ${file.name}`, "info");
    } catch (err) {
      showToast(err.message, "error");
    }
  }, [showToast]);

  return {
    // State
    mode, setMode,
    input, setInput,
    manualShift, setManualShift,
    result,
    busy,
    fileRef,
    // Actions
    decode,
    reset,
    loadFile,
    dropFile,
  };
}

/**
 * @typedef {object} DecoderState
 * @property {'auto'|'manual'} mode
 * @property {Function} setMode
 * @property {string}   input
 * @property {Function} setInput
 * @property {number}   manualShift
 * @property {Function} setManualShift
 * @property {object|null} result
 * @property {boolean}  busy
 * @property {React.Ref} fileRef
 * @property {Function} decode
 * @property {Function} reset
 * @property {Function} loadFile
 * @property {Function} dropFile
 */