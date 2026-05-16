// ═══════════════════════════════════════════════════════════════
// engine/constants.js
// All magic numbers, config, and shared constants for the app.
// No imports. No React. Pure data.
// ═══════════════════════════════════════════════════════════════

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const ALPHABET_LOWER = "abcdefghijklmnopqrstuvwxyz";
export const ALPHABET_SIZE = 26;

export const FILE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const TOAST_DURATION_MS = 3200;
export const DECODE_DEBOUNCE_MS = 80;
export const ENCRYPT_DEBOUNCE_MS = 60;

export const SHIFT_MIN = 0;
export const SHIFT_MAX = 25;
export const SHIFT_DEFAULT_ENCRYPT = 3;
export const SHIFT_DEFAULT_DECRYPT = 3;

export const AUTODETECT_CANDIDATES = 8; // top N candidates to surface
export const MIN_LETTERS_FOR_DETECTION = 3; // below this, skip chi-squared

// English letter frequency baseline (percentage)
export const ENGLISH_FREQ = {
  a: 8.167, b: 1.492, c: 2.782, d: 4.253, e: 12.702, f: 2.228,
  g: 2.015, h: 6.094, i: 6.966, j: 0.153, k: 0.772, l: 4.025,
  m: 2.406, n: 6.749, o: 7.507, p: 1.929, q: 0.095, r: 5.987,
  s: 6.327, t: 9.056, u: 2.758, v: 0.978, w: 2.360, x: 0.150,
  y: 1.974, z: 0.074,
};

// Navigation panel IDs
export const PANEL_IDS = {
  DECODER:   "decoder",
  ENCRYPTER: "encrypter",
  ANALYSIS:  "analysis",
  REPORT:    "report",
  HELP:      "help",
};

// Navigation config (used by Sidebar + TopBar)
export const NAV_ITEMS = [
  { id: PANEL_IDS.DECODER,   icon: "ti-lock-open",       label: "Decoder",   section: "tools" },
  { id: PANEL_IDS.ENCRYPTER, icon: "ti-lock",             label: "Encrypter", section: "tools" },
  { id: PANEL_IDS.ANALYSIS,  icon: "ti-chart-histogram",  label: "Analysis",  section: "tools" },
  { id: PANEL_IDS.REPORT,    icon: "ti-file-description", label: "Report",    section: "info"  },
  { id: PANEL_IDS.HELP,      icon: "ti-help-circle",      label: "Help",      section: "info"  },
];