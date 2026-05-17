# CaesarCipher Pro

> A high-performance cryptanalysis tool for real-time Caesar cipher encryption, decryption, and automated frequency analysis — built with React, Vite, and a custom chi-squared engine.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-caesar--cipher--pro.netlify.app-blue?style=flat-square)](https://caesar-cipher-pro.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)](https://vitejs.dev/)

---

## Overview

CaesarCipher Pro is a browser-based cryptanalysis application that goes beyond a simple ROT-N substitution tool. The core feature is an **automated shift detection engine** powered by chi-squared (χ²) statistical analysis — the same frequency analysis technique used in classical cryptanalysis. Given any ciphertext, the engine evaluates all 26 possible shifts, scores each one against English letter frequency baselines, and surfaces the most probable plaintext alongside a calibrated confidence score.

The application is designed with a clean separation between **cryptographic logic** and **UI** — the entire math layer is a pure, framework-free JavaScript module with no React dependencies, making it independently testable and reusable.

---

## Live Demo

**[https://caesar-cipher-pro.netlify.app/](https://caesar-cipher-pro.netlify.app/)**

| Desktop | Mobile |
|---|---|
| Full sidebar navigation with persistent state | Responsive drawer navigation via hamburger menu |
| Side-by-side frequency chart comparisons | Stacked single-column layout |
| Full-width analysis dashboard | Touch-friendly inputs and controls |

---

## Features

### Decoder
- **Auto-Detect mode** — runs chi-squared analysis across all 26 shifts and returns the best candidate with confidence scoring
- **Manual Shift mode** — apply a known ROT-N key directly for instant decryption
- Drag-and-drop `.txt` file upload (up to 5 MB)
- Decrypted output with copy, save, and direct pipe to Encrypter

### Encrypter
- Apply any ROT-0 through ROT-25 shift to plaintext
- **Live Shift Map** — visual A→Z alphabet mapping updates in real time as shift changes
- Encrypted output with copy, save, and direct pipe to Decoder for round-trip verification

### Frequency Analysis
- Grouped bar chart comparing **Cipher text**, **Decrypted text**, and **English baseline** letter distributions side by side
- χ² score chart ranking all 8 best shift candidates visually (lower bar = better English match)
- Frequency table exportable as CSV or copied to clipboard
- Custom text input for ad-hoc frequency analysis on any text

### Analysis Report
- Auto-generated structured report after every decode operation
- Includes: input statistics, detection results, top shift candidates, 4-step analysis breakdown, and the full untruncated decrypted output
- Exportable as plain `.txt` file or copyable to clipboard

---

## How the Auto-Detection Engine Works

The detection engine lives entirely in `src/engine/cipherEngine.js` and has zero UI dependencies.

### Step 1 — Letter Frequency Extraction
The engine counts every alphabetic character in the ciphertext (case-insensitive) and converts raw counts to percentages, building a 26-letter frequency map.

### Step 2 — Chi-Squared Scoring
For each of the 26 possible Caesar shifts (ROT-0 through ROT-25), the engine computes a chi-squared statistic:

$$\chi^2 = \sum_{i=a}^{z} \frac{(O_i - E_i)^2}{E_i}$$

Where:
- $O_i$ = observed frequency of letter $i$ in the shifted ciphertext
- $E_i$ = expected frequency of letter $i$ in standard English

Both values are on the same percentage scale (0–100), matching the `ENGLISH_FREQ` baseline in `constants.js`. **Lower χ² = better match to English.**

### Step 3 — Shift Selection
Shifts are ranked by χ² score ascending. The lowest-scoring shift is selected as the best candidate.

### Step 4 — Confidence Scoring
Confidence is computed from **three independent signals** — not just relative spread between candidates:

| Signal | What it measures |
|---|---|
| **Absolute χ² quality** | Does the best candidate actually look like English? Mapped against calibrated thresholds derived from real text measurements. |
| **Separation ratio** | Is the best candidate clearly better than the runner-up? Penalises up to 30 points when the two are too close. |
| **Short-text penalty** | Is there enough data? Penalises up to 40 points for inputs under 150 letters. |

This replaces the original relative-spread formula `(worstChi - bestChi) / worstChi` which produced inflated scores (99–100%) when plaintext was fed directly as input.

**Calibrated thresholds (real English text measurements):**

| Letters analysed | Typical best χ² | Expected confidence |
|---|---|---|
| 500+ | ~14–15 | 85–90% |
| 170 | ~29 | ~76% |
| 114 | ~37 | ~62% |
| < 20 | unreliable | blocked |

---

## Project Architecture

The application follows a strict **Separation of Concerns** architecture. Cryptographic logic, UI state, browser side-effects, and presentation are each isolated in their own layer with no cross-layer leakage.

```
caesar-cipher-tool/
│
├── public/                         # Static assets (favicon, etc.)
│
├── src/
│   │
│   ├── engine/                     # Cryptographic core — zero UI, zero React
│   │   ├── cipherEngine.js         # encrypt · decrypt · autoDetect · manualDecrypt · getFrequency
│   │   ├── constants.js            # ENGLISH_FREQ · shift limits · timing · nav config
│   │   └── index.js                # Barrel export
│   │
│   ├── hooks/                      # React state logic — no JSX, no rendering
│   │   ├── useDecoder.js           # Decoder state, debounced analysis, result management
│   │   ├── useEncrypter.js         # Encrypter state, shift map generation
│   │   ├── useToast.js             # Toast notification queue
│   │   └── index.js                # Barrel export
│   │
│   ├── services/                   # Browser API abstractions — no state, no rendering
│   │   ├── clipboardService.js     # Clipboard read / write
│   │   ├── fileService.js          # File upload · drag-and-drop · .txt read
│   │   ├── reportService.js        # Report assembly and .txt download
│   │   └── index.js                # Barrel export
│   │
│   ├── components/                 # Reusable UI — stateless where possible
│   │   │
│   │   ├── primitives/             # Single-responsibility atoms
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── NoteBox.jsx
│   │   │   ├── ResultBox.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── charts/                 # Data visualisation components
│   │   │   ├── ChiChart.jsx        # χ² score bar chart (shift candidates)
│   │   │   ├── ConfRing.jsx        # Confidence ring (circular progress)
│   │   │   ├── FreqBarChart.jsx    # Grouped frequency bar chart
│   │   │   ├── LegendDot.jsx       # Chart legend indicator
│   │   │   └── index.js
│   │   │
│   │   └── navigation/             # Layout and routing chrome
│   │       ├── Sidebar.jsx         # Desktop persistent sidebar
│   │       ├── SidebarFooter.jsx   # Developer info and links
│   │       ├── TopBar.jsx          # Mobile header + hamburger drawer
│   │       ├── NavItem.jsx         # Single navigation link
│   │       └── index.js
│   │
│   ├── panels/                     # Top-level views — one per sidebar route
│   │   ├── DecoderPanel.jsx        # Auto-detect and manual shift decryption
│   │   ├── EncrypterPanel.jsx      # Plaintext encryption with live shift map
│   │   ├── AnalysisPanel.jsx       # Interactive frequency analysis dashboard
│   │   ├── ReportPanel.jsx         # Structured exportable decode report
│   │   └── HelpPanel.jsx           # Reference documentation
│   │
│   ├── styles/                     # Modular CSS — no component logic
│   │   ├── tokens.css              # CSS custom properties (colours, spacing, type)
│   │   ├── layout.css              # Page structure and sidebar layout
│   │   ├── components.css          # Primitive component styles
│   │   ├── charts.css              # Chart-specific styles
│   │   ├── panels.css              # Panel-level layout styles
│   │   ├── animations.css          # Keyframes and transitions
│   │   └── index.css               # Style entry point (imports all above)
│   │
│   ├── App.jsx                     # Root — panel routing and global state
│   └── main.jsx                    # React entry point
│
├── index.html                      # HTML shell
├── vite.config.js                  # Build configuration
└── package.json
```

### Key Design Decisions

**Engine isolation** — `cipherEngine.js` imports nothing outside `constants.js`. Every exported function is pure and deterministic, making the entire math layer unit-testable without mounting a single React component or touching the DOM.

**Barrel exports** — every `engine/`, `hooks/`, `services/`, and `components/` subdirectory has an `index.js` that re-exports its public API. Consumers import from the folder, not the file, so internal refactoring never cascades outward.

**Hook-driven state** — panels contain no business logic. Stateful concerns (debouncing, mode switching, result accumulation) live entirely in `hooks/`, keeping JSX focused on structure and rendering.

**Service layer** — clipboard writes, file reads, and report generation are extracted into `services/` so panels never call browser APIs directly. This keeps components testable and the side-effect boundary explicit.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite + Rolldown |
| Styling | Modular CSS with CSS custom properties |
| Crypto Engine | Vanilla JavaScript (ES Modules) |
| Deployment | Netlify |
| Language | JavaScript (ES2022) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/4reeb-5yed/caesar-cipher-tool.git

# Navigate into the project directory
cd caesar-cipher-tool/caesar-cipher-tool

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot module replacement.

### Production Build

```bash
npm run build
```

Output is written to `dist/`. The build is optimised by Vite's Rolldown bundler for minimal bundle size and fast loading.

### Preview Production Build Locally

```bash
npm run preview
```

---

## Usage

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Run decode or encrypt from the active input |

### Decoding a Ciphertext

1. Navigate to **Decoder** in the sidebar
2. Paste ciphertext into the input area (or drag-and-drop a `.txt` file)
3. Select **Auto-Detect** to let the engine find the shift, or **Manual Shift** if you know the key
4. Click **Decode** or press `Ctrl+Enter`
5. Review the decrypted output, confidence score, and top shift candidates

### Encrypting Plaintext

1. Navigate to **Encrypter**
2. Paste or type plaintext
3. Set the shift value (ROT-N)
4. Click **Encrypt** — the shift map and encrypted output update immediately
5. Use **→ Decoder** to send the ciphertext directly to the Decoder for round-trip verification

### Frequency Analysis

1. Decode a ciphertext first (or use **Analyze Custom Text** in the Analysis panel)
2. Navigate to **Analysis**
3. Review the grouped bar chart comparing cipher, decrypted, and English baseline frequencies
4. The χ² score chart ranks all 8 best shift candidates — wider bar = lower χ² = better English match

---

## Limitations

- Frequency analysis is most reliable on texts with **50+ letters**. Short inputs produce low confidence scores by design and should be verified manually using the top candidates table.
- The chi-squared engine is calibrated for **English language text** only. Non-English ciphertexts will produce low confidence scores regardless of shift.
- The Caesar cipher provides **no real cryptographic security**. It can be broken in milliseconds by any computer. This tool is intended for education, puzzles, and historical study only.

---

## License

MIT License — open source, free to use. See [LICENSE](./LICENSE) for full terms.

---

## Developer

**Areeb Syed** — Software Developer

[![GitHub](https://img.shields.io/badge/GitHub-4reeb--5yed-181717?style=flat-square&logo=github)](https://github.com/4reeb-5yed)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-areeb--syed-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/areeb-syed-b19491245)
[![Email](https://img.shields.io/badge/Email-4reeb.5yed%40gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:4reeb.5yed@gmail.com)
