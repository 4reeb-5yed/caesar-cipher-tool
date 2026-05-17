// ═══════════════════════════════════════════════════════════════
// services/fileService.js
// Async file I/O. No React. No Engine calls.
// ═══════════════════════════════════════════════════════════════

import { FILE_MAX_BYTES } from "../engine/constants.js";

const FileService = {
  /**
   * Read a File object as UTF-8 text.
   *
   * @param {File} file
   * @returns {Promise<string>}
   */
  read(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("No file provided"));
      if (file.size > FILE_MAX_BYTES) {
        return reject(new Error(`File too large — maximum size is ${FILE_MAX_BYTES / 1024 / 1024} MB`));
      }
      const reader = new FileReader();
      reader.onload  = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file, "UTF-8");
    });
  },

  /**
   * Trigger a browser download of `text` as a plain-text file.
   *
   * @param {string} text      Full content to write
   * @param {string} filename  e.g. "report.txt"
   */
  download(text, filename) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  /**
   * Trigger a browser download of frequency data as a CSV file.
   *
   * @param {Record<string, number>} freqMap  Letter → percentage
   * @param {string} filename
   */
  downloadCSV(freqMap, filename = "frequency.csv") {
    const rows = ["Letter,Frequency (%)"];
    for (const letter of "abcdefghijklmnopqrstuvwxyz") {
      rows.push(`${letter.toUpperCase()},${(freqMap[letter] ?? 0).toFixed(4)}`);
    }
    this.download(rows.join("\n"), filename);
  },
};

export default FileService;