// ═══════════════════════════════════════════════════════════════
// hooks/useToast.js
// Toast notification state manager.
// No Engine, no Service, no UI component imports.
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { TOAST_DURATION_MS } from "../engine/constants.js";

/**
 * @typedef {'success'|'error'|'info'|'warn'} ToastType
 * @typedef {{ id: number, msg: string, type: ToastType }} Toast
 */

/**
 * Provides a toast queue and a `show` function to add toasts.
 *
 * @returns {{ toasts: Toast[], show: (msg: string, type?: ToastType) => void }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts(prev => prev.filter(t => t.id !== id)),
      TOAST_DURATION_MS
    );
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, show, dismiss };
}