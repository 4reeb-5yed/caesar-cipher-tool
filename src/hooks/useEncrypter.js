// ═══════════════════════════════════════════════════════════════
// hooks/useEncrypter.js
// All state and actions for the Encrypter panel.
//
// RULES:
//   - Calls CipherEngine + FileService. Never calls UI components.
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback } from "react";
import { encrypt } from "../engine/cipherEngine.js";
import { SHIFT_DEFAULT_ENCRYPT, ENCRYPT_DEBOUNCE_MS } from "../engine/constants.js";
import FileService from "../services/fileService.js";

/**
 * @returns {EncrypterState}
 */
export function useEncrypter(showToast) {
  const [input,  setInput]  = useState("");
  const [shift,  setShift]  = useState(SHIFT_DEFAULT_ENCRYPT);
  const [result, setResult] = useState("");
  const [busy,   setBusy]   = useState(false);
  const fileRef = useRef(null);

  /** Run the encrypt operation. */
  const runEncrypt = useCallback(() => {
    const text = input.trim();
    if (!text) {
      showToast("Enter text to encrypt", "error");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      try {
        const s = Math.max(0, Math.min(25, parseInt(shift) || 0));
        setResult(encrypt(text, s));
        showToast("Encrypted successfully", "success");
      } catch (err) {
        showToast("Encrypt error: " + err.message, "error");
      } finally {
        setBusy(false);
      }
    }, ENCRYPT_DEBOUNCE_MS);
  }, [input, shift, showToast]);

  /** Clear input and result. */
  const reset = useCallback(() => {
    setInput("");
    setResult("");
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
    if (e.target) e.target.value = "";
  }, [showToast]);

  return {
    // State
    input, setInput,
    shift, setShift,
    result, setResult,
    busy,
    fileRef,
    // Actions
    runEncrypt,
    reset,
    loadFile,
  };
}

/**
 * @typedef {object} EncrypterState
 * @property {string}   input
 * @property {Function} setInput
 * @property {number}   shift
 * @property {Function} setShift
 * @property {string}   result
 * @property {Function} setResult
 * @property {boolean}  busy
 * @property {React.Ref} fileRef
 * @property {Function} runEncrypt
 * @property {Function} reset
 * @property {Function} loadFile
 */