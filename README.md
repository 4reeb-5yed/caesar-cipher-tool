# Caesar Cipher Tool

A modular React application for encrypting and decrypting text using the Caesar Cipher technique. It includes a frequency analysis feature to help identify the correct shift key for encrypted text.

## Features
- **Encryption & Decryption**: Manual shift selection (0-25).
- **Auto-Detection**: Basic frequency analysis using Chi-squared ($\chi^2$) to suggest the most likely shift.
- **Visual Charts**: SVG bar charts comparing input frequency against English language averages.
- **Modular Design**: Separated into logic (engine), state (hooks), and UI (components).
- **Reports**: Generate a plain-text summary of the analysis.

## Project Structure
- `src/engine/`: Core logic for shifting characters and calculating frequency.
- `src/hooks/`: React hooks for managing app state and notifications.
- `src/panels/`: Main interface views for decoding, encrypting, and analysis.
- `src/styles/`: CSS files for layout and themeing.

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
