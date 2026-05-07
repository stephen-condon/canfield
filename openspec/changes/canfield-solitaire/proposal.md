## Why

We want to build a feature-complete Canfield Solitaire desktop application to provide an engaging, extensible, and beautifully rendered card game experience. Currently, there is no implementation of this game in our environment. Building this now will establish a robust game engine and testable UI architecture that can be used for future projects.

## What Changes

- **NEW** Initialize an Electron + Vue.js + Vite application for the desktop environment.
- **NEW** Implement a pure TypeScript game engine for Canfield Solitaire rules, state, and move validation (Hardcore Mode: No Undo).
- **NEW** Create a Main Menu with "Start New Game", "Resume Game", "Statistics", and "Preferences" navigation.
- **NEW** Add a persistent Statistics tracking system for Wins, Losses, and Win Percentage viewable from the Main Menu.
- **NEW** Add a Preferences system to allow users to customize their game (import custom card backs and backgrounds, configure Draw Rules).
- **NEW** Implement a native HTML5 drag-and-drop system and Double-Click auto-move functionality.
- **NEW** Implement Auto-Save functionality to `electron-store` to persist game sessions, along with Time and Move tracking metrics.
- **NEW** Integrate Vitest (>80% unit test coverage for engine and UI components) and Playwright for End-to-End testing.

## Capabilities

### New Capabilities
- `game-engine`: Core rules, state management, deck generation, auto-save serialization, and metrics tracking.
- `ui-layout`: Main Menu, Preferences screen, Statistics Screen, HUD (Time/Moves), and Game Board view.
- `card-interaction`: HTML5 drag-and-drop logic and double-click auto-move to foundations.
- `extensibility`: System for importing custom assets, configuring Draw Rules, and persistent Statistics via `electron-store`.

### Modified Capabilities

## Impact

- **New App Generation:** A completely new Electron/Vue project will be scaffolded.
- **Dependencies:** New dependencies including `electron`, `vue`, `vue-router`, `electron-store`, `vitest`, `playwright`, and `vue-test-utils` will be introduced.
