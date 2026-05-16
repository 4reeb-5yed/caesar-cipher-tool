# Caesar Cipher Tool

A modular React application for encrypting and decrypting text using the Caesar Cipher technique. It includes a frequency analysis feature to help identify the correct shift key for encrypted text.

## Features
- **Encryption & Decryption**: Manual shift selection (0-25).
- **Auto-Detection**: Basic frequency analysis using Chi-squared ($\chi^2$) to suggest the most likely shift.
- **Visual Charts**: SVG bar charts comparing input frequency against English language averages.
- **Modular Design**: Separated into logic (engine), state (hooks), and UI (components).
- **Reports**: Generate a plain-text summary of the analysis.

## Project Structure
src/
├── components/   # Reusable UI parts (Buttons, Cards, Charts)
├── engine/       # Cipher logic and frequency constants
├── hooks/        # Custom React hooks (useToast, useDecoder)
├── panels/       # View containers (DecoderPanel, AnalysisPanel)
├── services/     # Utility services (File and Clipboard handling)
├── styles/       # CSS modules and design tokens
├── App.jsx       # Main Application entry and global state
└── main.jsx      # React DOM rendering entry point

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npx vite
   ```
3. Open http://localhost:5173 in your browser.

   Built With
   - React
   - Vite
   - Tabler Icons
