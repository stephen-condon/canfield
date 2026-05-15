# Canfield Solitaire

A robust, desktop-based Canfield Solitaire game built with Electron, Vue.js, and TypeScript. This project features a decoupled game engine, persistent statistics, and a customizable user experience.

See [CONTRIBUTIONS.md](file:///Users/stephen/antigravity-apps/canfield/CONTRIBUTIONS.md) for guidelines on how to help improve this project.

## Game Rules (Function)

Canfield is a challenging solitaire variant that requires both skill and a bit of luck.

### Objective
The goal is to move all 52 cards to the four **Foundation** piles, building them up by suit.

### Setup
- **Foundations**: Four piles. The first card dealt (the "Base Rank") determines the starting rank for all four foundations. Cards are built up in suit, wrapping from King to Ace if necessary.
- **Tableau**: Four columns, each starting with one card. Piles are built down in alternating colors (e.g., a red 7 on a black 8).
- **Reserve (The "Store")**: A pile of 13 cards. Only the top card is visible and playable.
- **Stock & Waste**: The remaining cards. They are typically dealt three at a time to the Waste pile.

### Key Rules
- **Filling Vacancies**: When a tableau column becomes empty, it **must** be filled by the top card of the Reserve. If the Reserve is empty, any card or legal sequence can fill the vacancy.
- **Building Foundations**: Piles must follow the suit and rank sequence, starting from the Base Rank.
- **Moving Cards**: You can move single cards or legally built sequences within the tableau.

## Technical Architecture

The application is designed with a focus on testability, performance, and persistence.

### Tech Stack
- **Framework**: [Electron](https://www.electronjs.org/) for cross-platform desktop deployment.
- **Frontend**: [Vue.js 3](https://vuejs.org/) with [Vite](https://vitejs.dev/) for a fast, reactive UI.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety across the engine and UI.
- **Persistence**: [electron-store](https://github.com/sindresorhus/electron-store) for saving preferences, game state (auto-save), and lifetime statistics.

### Core Components
- **Game Engine**: A pure, decoupled TypeScript module (`src/renderer/src/engine/CanfieldEngine.ts`) that manages the game state, validates moves, and handles deck shuffling. Being decoupled from the UI allows for >80% unit test coverage.
- **UI Layer**: Vue components handle the visual representation and user interactions (Native HTML5 Drag and Drop, Double-click to auto-move).
- **Storage Service**: Manages data persistence, ensuring games can be resumed and statistics (Wins/Losses) are tracked accurately.

### Testing Strategy
- **Unit Testing**: [Vitest](https://vitest.dev/) for rigorous testing of the game logic and component behavior.
- **E2E Testing**: [Playwright](https://playwright.dev/) for simulating user workflows and ensuring the Electron integration works as expected.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
