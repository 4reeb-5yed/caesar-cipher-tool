# Confidence Scoring System

Caesar Cipher Pro uses a multi-factor confidence evaluation system designed to estimate the reliability of detected plaintext candidates.

The scoring architecture was specifically designed to avoid artificially inflated confidence values commonly produced by simplistic frequency-analysis implementations.

---

# Problem Statement

Basic Caesar cipher detectors often calculate confidence using only relative score spread.

Example:

```txt
(worstChi - bestChi) / worstChi
```

This approach creates misleading results:
- plaintext inputs may incorrectly receive near-100% confidence
- short ciphertexts appear statistically reliable
- ambiguous candidates are not penalized
- small score differences are exaggerated

The confidence system in Caesar Cipher Pro was engineered to address these weaknesses.

---

# Confidence Architecture

The confidence score combines multiple analytical signals:

```txt
Final Confidence
    =
Absolute χ² Quality
    +
Candidate Separation
    -
Short-Text Penalties
```

Each factor evaluates a different aspect of statistical reliability.

---

# 1. Absolute χ² Quality

The first signal evaluates whether the best candidate actually resembles natural English text.

Lower χ² scores indicate:
- stronger frequency alignment
- more probable plaintext recovery
- higher statistical confidence

Example:

```txt
χ² = 14 → strong English similarity
χ² = 38 → weak statistical similarity
χ² = 90 → unreliable candidate
```

The system maps χ² ranges against calibrated confidence thresholds derived from real English-language samples.

---

# 2. Candidate Separation Ratio

The second signal evaluates how clearly the best candidate outperforms competing shifts.

Example:

```txt
Best Candidate   → χ² = 15
Second Candidate → χ² = 16
```

Although the best candidate technically wins, the separation is extremely weak.

This suggests:
- ambiguity
- unreliable recovery
- insufficient statistical distinction

The engine penalizes low separation ratios to reduce false confidence inflation.

---

# 3. Short-Text Penalty

Short ciphertexts contain insufficient statistical data for reliable frequency analysis.

Example:

```txt
HELLO
```

contains too few letters to produce stable distributions.

The system applies progressive penalties for:
- low character count
- sparse frequency distributions
- statistically unstable samples

Very short inputs may be classified as unreliable regardless of χ² ranking quality.

---

# Calibration Model

The scoring model was calibrated against real English-language samples of varying lengths.

Example reference ranges:

| Text Length | Typical χ² | Expected Confidence |
|---|---|---|
| 500+ chars | 14–16 | High |
| 150 chars | 25–35 | Moderate |
| < 20 chars | unstable | Low |

This calibration improves consistency across differently sized ciphertexts.

---

# Confidence Pipeline

```txt
Candidate Ranking
        ↓
Best χ² Extraction
        ↓
Runner-Up Comparison
        ↓
Separation Evaluation
        ↓
Text-Length Analysis
        ↓
Penalty Application
        ↓
Final Confidence Score
```

---

# Design Objectives

The confidence system was designed to prioritize:
- statistical honesty
- ambiguity reduction
- realistic reliability estimation
- explainable evaluation
- deterministic scoring

The resulting model produces more conservative and analytically meaningful confidence estimates than simplistic relative-spread approaches.

---

# Engineering Rationale

The confidence architecture intentionally separates:
- candidate quality
- candidate uniqueness
- sample reliability

This multi-factor approach improves:
- interpretability
- trustworthiness
- educational value
- analytical realism

The system therefore functions as a statistical reliability estimator rather than a cosmetic confidence indicator.