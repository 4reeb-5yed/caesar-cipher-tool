# Chi-Squared Statistical Analysis

Caesar Cipher Pro uses chi-squared (χ²) statistical analysis to automatically identify the most probable Caesar cipher shift from ciphertext input.

The engine evaluates all 26 possible shifts and compares the resulting frequency distributions against expected English-language letter frequencies.

The lowest χ² score is selected as the strongest plaintext candidate.

---

# Statistical Foundation

The analysis pipeline is based on classical frequency-analysis techniques used in cryptanalysis.

Each shifted candidate is evaluated using the chi-squared formula:

```txt
χ² = Σ ((O - E)² / E)
```

Where:
- `O` = observed frequency of a letter
- `E` = expected English-language frequency

Lower χ² values indicate stronger similarity to natural English text.

---

# Frequency Extraction Pipeline

The engine first normalizes ciphertext input by:
- converting text to uppercase
- filtering non-alphabetic characters
- counting occurrences of A–Z

The resulting counts are converted into percentage distributions.

Example:

```txt
A → 8.2%
B → 1.5%
C → 2.8%
...
```

These observed values are then compared against baseline English frequencies.

---

# English Baseline Frequencies

The engine uses a predefined English frequency model.

Example:

```txt
E → 12.7%
T → 9.1%
A → 8.2%
O → 7.5%
...
```

These values represent approximate frequencies found in natural English-language text corpora.

---

# Candidate Generation

The engine generates all possible Caesar shifts:

```txt
ROT-0
ROT-1
ROT-2
...
ROT-25
```

Each candidate undergoes:
1. shift transformation
2. frequency extraction
3. χ² evaluation
4. candidate ranking

---

# Candidate Ranking

All shift candidates are sorted by χ² score ascending.

Example:

```txt
ROT-13 → χ² = 14.2
ROT-7  → χ² = 31.8
ROT-2  → χ² = 44.6
```

The smallest χ² value represents the statistically closest match to English plaintext.

---

# Confidence Evaluation

The platform does not rely solely on χ² ranking.

Confidence scoring additionally incorporates:
- absolute χ² quality
- separation ratio between top candidates
- short-text penalties
- ambiguity reduction

This prevents inflated confidence values on:
- extremely short ciphertexts
- already-readable plaintext
- statistically ambiguous samples

---

# Visualization Systems

The analysis layer exposes statistical results through:
- grouped frequency bar charts
- χ² candidate ranking charts
- confidence indicators
- comparative frequency views

This transforms raw cryptographic analysis into interpretable visual output.

---

# Analytical Pipeline

```txt
Ciphertext
      ↓
Normalization
      ↓
Frequency Extraction
      ↓
26 Shift Generation
      ↓
χ² Statistical Evaluation
      ↓
Candidate Ranking
      ↓
Confidence Evaluation
      ↓
Plaintext Recovery
```

---

# Design Objectives

The χ² engine was designed to prioritize:
- deterministic output
- statistical transparency
- explainable cryptanalysis
- reproducible analysis
- visual interpretability

The resulting system functions as a structured educational cryptanalysis environment rather than a basic substitution utility.