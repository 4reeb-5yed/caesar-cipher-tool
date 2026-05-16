// ═══════════════════════════════════════════════════════════════
// services/clipboardService.js
// Clipboard write utility. No React. No Engine.
// Falls back to execCommand for environments without Clipboard API.
// ═══════════════════════════════════════════════════════════════

const ClipboardService = {
  /**
   * Copy `text` to the system clipboard.
   *
   * @param {string} text
   * @returns {Promise<boolean>}  true on success, false on failure
   */
  async copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback: use legacy execCommand
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity  = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch {
        return false;
      }
    }
  },
};

export default ClipboardService;