#  Caesar Cipher Pro

A high-performance cryptographic web application designed for real-time encryption, decryption, and automated frequency analysis. This tool leverages the **Chi-Squared ($\chi^2$) statistic** to automatically crack ciphertexts by identifying the most probable shift key based on English language patterns.

🔗 **Live Demo:** [https://caesar-cipher-pro.netlify.app/](https://caesar-cipher-pro.netlify.app/)

---

##  How to Use

###  On Mobile & Tablet
1. Open your browser and navigate to the [Live Link](https://caesar-cipher-pro.netlify.app/).
2. The UI is fully responsive. Access different tools via the **Hamburger Menu** at the top left.

###  On Desktop
1. Access the [Live Link](https://caesar-cipher-pro.netlify.app/) for a full-width experience.
2. Use the persistent **Sidebar** on the left to switch between the Encrypter, Decoder, and Analysis panels.
3. Utilize the **Analysis Panel** to view real-time frequency charts and let the engine solve the cipher for you.

---

##  Project Architecture
The application is built with a modular "Separation of Concerns" architecture, ensuring logic, styles, and UI components are decoupled for scalability.

```text
CAESAR-CIPHER-TOOL/             # Parent Root
└── caesar-cipher-tool/         # Project Root Folder
    ├── dist/                   # Production Build Output (Assets, JS, CSS)
    ├── node_modules/           # Dependencies
    ├── public/                 # Static Assets (favicon.png)
    ├── src/                    # Source Code
    │   ├── components/         # UI Components
    │   │   ├── charts/         # ChiChart, ConfRing, FreqBarChart, LegendDot
    │   │   ├── navigation/     # Sidebar, SidebarFooter, TopBar, NavItem
    │   │   └── primitives/     # Badge, Button, Card, NoteBox, ResultBox, etc.
    │   ├── engine/             # Math Logic (cipherEngine.js, constants.js)
    │   ├── hooks/              # Custom Hooks (useDecoder, useEncrypter, useToast)
    │   ├── panels/             # Main Views (Analysis, Decoder, Encrypter, etc.)
    │   ├── services/           # Logic Layers (clipboard, file, report services)
    │   ├── styles/             # Modular CSS (layout, tokens, animations)
    │   ├── App.jsx             # Main Application Logic
    │   └── main.jsx            # React Entry Point
    ├── .gitignore              # Git exclusion file
    ├── index.html              # HTML Shell
    ├── package.json            # Scripts & Dependencies
    ├── README.md               # Documentation
    └── vite.config.js          # Build Configuration
```

##  Technical Features

- Chi-Squared Analysis: Automatically calculates the mathematical likelihood of each possible shift (0-25) and suggests the correct key.

- Modular Design: Implements the Barrel Export pattern (index.js) across components, hooks, and services for clean imports.

- Responsive Sidebar: A custom-engineered navigation system that transitions from a fixed sidebar to a mobile-friendly drawer.

- Production Build: Optimized using Vite and Rolldown for minimal bundle sizes and high-speed loading.


## 🛠️ Installation & Setup

To run this project locally:

1.Clone the Repository:

```Bash
git clone [https://github.com/4reeb-5yed/caesar-cipher-tool.git](https://github.com/4reeb-5yed/caesar-cipher-tool.git)
```

2.Navigate to the Project Directory:

```Bash
cd caesar-cipher-tool/caesar-cipher-tool
```

3.Install Dependencies:
```Bash
npm install
```
3.Run in Development Mode:
```Bash
npm run dev
```

4.Build for Production:
```Bash
npm run build
```

# Developer: Areeb Syed
- Role: Software Developer
- GitHub: [https://github.com/4reeb-5yed](https://github.com/4reeb-5yed)
- LinkedIn: [https://www.linkedin.com/in/areeb-syed-b19491245](https://www.linkedin.com/in/areeb-syed-b19491245)
- Primary Email: 4reeb.5yed@gmail.com
- Secondary Email: areeb.syed1@outlook.com

# 📄 License
- Type: MIT License
- Usage: Open-source. Permission is hereby granted, free of charge, to any person 
  obtaining a copy of this software and associated documentation files.
