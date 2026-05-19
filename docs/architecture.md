# Architecture

Caesar Cipher Pro is structured as a layered cryptographic analysis system designed around strict separation between:

- computation
- orchestration
- browser interaction
- rendering
- visualization

The architecture prioritizes deterministic analytical computation while maintaining modular scalability across the interface layer.

---

# High-Level System Architecture

```txt
┌──────────────────────────────────────────────┐
│                  User Input                 │
│     Ciphertext · Plaintext · File Upload    │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 Panels Layer                │
│ Decoder · Encrypter · Analysis · Reports    │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 Hooks Layer                 │
│ useDecoder · useEncrypter · useToast        │
└──────────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌──────────────────┐      ┌────────────────────┐
│   Engine Layer   │      │   Services Layer   │
│ Cryptographic    │      │ Clipboard · Files  │
│ Computation      │      │ Reports · Exports  │
└──────────────────┘      └────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│             Statistical Analysis            │
│ Frequency Extraction · χ² Evaluation        │
│ Candidate Ranking · Confidence Scoring      │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│               Components Layer              │
│ Charts · Navigation · UI Primitives         │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                Rendering Layer              │
│ Responsive Dashboard · Reports · Charts     │
└──────────────────────────────────────────────┘
```

---

# Repository Structure

```txt
caesar-cipher-tool/
│
├── assets/
│   └── screenshots/
│
├── docs/
│   ├── architecture.md
│   ├── chi-squared-analysis.md
│   ├── confidence-scoring.md
│   └── design-decisions.md
│
├── public/
│
├── src/
│   │
│   ├── engine/
│   │   ├── cipherEngine.js
│   │   ├── constants.js
│   │   └── index.js
│   │
│   ├── hooks/
│   │   ├── useDecoder.js
│   │   ├── useEncrypter.js
│   │   ├── useToast.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── clipboardService.js
│   │   ├── fileService.js
│   │   ├── reportService.js
│   │   └── index.js
│   │
│   ├── components/
│   │   │
│   │   ├── charts/
│   │   │   ├── ChiChart.jsx
│   │   │   ├── ConfRing.jsx
│   │   │   ├── FreqBarChart.jsx
│   │   │   ├── LegendDot.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── navigation/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SidebarFooter.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── NavItem.jsx
│   │   │   └── index.js
│   │   │
│   │   └── primitives/
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── NoteBox.jsx
│   │       ├── ResultBox.jsx
│   │       ├── Spinner.jsx
│   │       ├── StatCard.jsx
│   │       ├── Toast.jsx
│   │       └── index.js
│   │
│   ├── panels/
│   │   ├── DecoderPanel.jsx
│   │   ├── EncrypterPanel.jsx
│   │   ├── AnalysisPanel.jsx
│   │   ├── ReportPanel.jsx
│   │   └── HelpPanel.jsx
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── charts.css
│   │   ├── panels.css
│   │   ├── animations.css
│   │   └── index.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── README.md
├── package.json
├── vite.config.js
└── index.html
```

---

# Execution Flow

The cryptographic execution pipeline follows a deterministic analytical workflow.

## Decoder Flow

```txt
Ciphertext Input
        ↓
Input Normalization
        ↓
Frequency Extraction
        ↓
26 Shift Candidate Generation
        ↓
χ² Statistical Evaluation
        ↓
Candidate Ranking
        ↓
Confidence Evaluation
        ↓
Plaintext Reconstruction
        ↓
Visualization & Reporting
```

---

# Engine Architecture

```txt
cipherEngine.js
│
├── encrypt()
├── decrypt()
├── autoDetect()
├── manualDecrypt()
├── getFrequency()
└── confidenceEvaluation()
```

The engine layer:
- contains zero UI rendering
- contains zero React state
- avoids browser-side dependencies
- remains deterministic and portable

This isolation allows the analytical core to remain independently testable.

---

# State Architecture

State orchestration is isolated into hooks.

```txt
useDecoder()
│
├── input management
├── analysis triggering
├── result storage
├── confidence handling
└── report synchronization
```

```txt
useEncrypter()
│
├── plaintext management
├── shift handling
├── live encryption
└── shift-map synchronization
```

This prevents business logic leakage into rendering components.

---

# Component Architecture

The UI layer is divided into:
- primitives
- analytical visualizations
- navigation systems
- workflow panels

Dependency direction:

```txt
Panels
   ↓
Components
   ↓
Hooks
   ↓
Engine / Services
```

The engine never depends upward on rendering systems.

---

# Statistical Analysis Architecture

The χ² evaluation pipeline operates on:
- observed ciphertext frequencies
- expected English frequencies

Formula:

```txt
χ² = Σ ((O - E)² / E)
```

Where:
- O = observed frequency
- E = expected English frequency

Lower χ² values indicate stronger statistical alignment with English-language plaintext.

---

# Confidence Architecture

Confidence scoring combines:
- absolute χ² quality
- candidate separation ratio
- short-text penalties

This prevents false-positive confidence inflation on ambiguous inputs.

---

# Responsive Layout Architecture

Desktop:
- persistent analytical sidebar
- multi-panel rendering
- dashboard-oriented layout

Mobile:
- drawer-based navigation
- stacked panel rendering
- touch-oriented interaction flow

---

# Design Objectives

The architecture was designed to prioritize:
- deterministic computation
- analytical transparency
- modular scalability
- reusable systems
- responsive rendering
- maintainable separation of concerns

The resulting platform functions as a structured cryptographic analysis environment rather than a simple Caesar cipher utility.