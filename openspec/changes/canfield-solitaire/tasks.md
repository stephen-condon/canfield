## 1. Setup and Tooling

- [x] 1.1 Scaffold Electron + Vue + Vite application foundation
- [x] 1.2 Install required dependencies (`vue-router`, `electron-store`, `vitest`, `@playwright/test`, `@vue/test-utils`)
- [x] 1.3 Configure Electron `BrowserWindow` with strict `minWidth` and `minHeight` constraints
- [x] 1.4 Setup Vue Router with stub components for `MainMenu`, `GameBoard`, `Statistics`, and `Preferences`

## 2. Game Engine (TypeScript)

- [x] 2.1 Define Core Types (`Card`, `Suit`, `Rank`, `GameState` with `elapsedTime` and `moves` tracking)
- [x] 2.2 Implement deck generation, shuffling, and dealing logic (13 Reserve, 1 Foundation, 4 Tableau, 34 Stock)
- [x] 2.3 Implement move validation logic for Foundations and Tableau placement
- [x] 2.4 Implement auto-filling empty Tableau columns from Reserve
- [x] 2.5 Implement Stock-to-Waste drawing logic (Supporting Draw 1 or Draw 3 configurations)
- [x] 2.6 Implement explicit Stock Redealing logic
- [x] 2.7 Implement Auto-Save serialization and deserialization methods
- [x] 2.8 Write Vitest suite for `CanfieldEngine` to ensure >80% rule coverage

## 3. Persistent Data (electron-store)

- [x] 3.1 Setup IPC bridge for `electron-store` to handle persistent state
- [x] 3.2 Implement Preferences saving (Backgrounds, Card Backs, Draw Rules)
- [x] 3.3 Implement Statistics tracking (Total Games, Wins, Losses) and `resetStatistics` method
- [x] 3.4 Implement Game State auto-saving on every valid move

## 4. UI Layout and Components

- [x] 4.1 Implement Main Menu View (Start Game, Resume Game, Statistics, Preferences buttons)
- [x] 4.2 Implement Statistics View (Display Win %, Wins, Losses, Reset button)
- [x] 4.3 Implement Preferences View UI (Background, Card Back, Draw Rules Toggle, Import OS File picker)
- [x] 4.4 Build Game Board View layout (Grid system) and HUD (Timer, Move Counter, Surrender button)
- [x] 4.5 Integrate crisp open-source SVG playing card assets and bind to Vue state
- [x] 4.6 Implement Victory Confetti animation and "Play Again" overlay

## 5. Card Interaction Mechanics

- [x] 5.1 Add native HTML5 `draggable="true"` and `dragstart` handlers to exposed, valid cards
- [x] 5.2 Add `dragover` and `drop` zone handlers to Foundations and Tableau columns
- [x] 5.3 Implement Double-Click auto-move to Foundations
- [x] 5.4 Wire Vue interactions into `CanfieldEngine` (incrementing move counter and triggering auto-save)
- [x] 5.5 Write Vue Test Utils component tests for drag/drop and double-click interactions

## 6. End-to-End Testing

- [x] 6.1 Setup Playwright configuration tailored for the compiled Electron app
- [x] 6.2 Write E2E test: Launch app, navigate to New Game, verify initial deal layout and HUD
- [x] 6.3 Write E2E test: Successfully draw a card from Stock to Waste
- [x] 6.4 Write E2E test: Successfully drag a valid card and drop it on a target zone
