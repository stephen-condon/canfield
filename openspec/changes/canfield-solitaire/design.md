## Context

Currently, the workspace contains rules for Canfield Solitaire but lacks an implementation. We are building a robust, desktop-based Canfield Solitaire game using modern web technologies wrapped in Electron. The implementation must have >80% test coverage and utilize an extensible architecture so users can customize their game experience.

## Goals / Non-Goals

**Goals:**
- Implement a fully playable Canfield Solitaire game with correct rules.
- Build a responsive Vue.js frontend packaged in Electron.
- Implement an extensible Preferences system using `electron-store`.
- Implement persistent Statistics tracking (Wins, Losses, Win %).
- Implement Quality of Life features: Auto-Save, Double-Click auto-move, Time/Moves tracking, and Explicit Stock Redealing.
- Achieve high testability via a decoupled TypeScript game engine and Playwright E2E coverage.

**Non-Goals:**
- We are not implementing an Undo system (Hardcore mode only).
- We are not implementing auto-detection of "Dead Ends" (Player must manually Surrender).
- We are not implementing other solitaire variants (e.g., Klondike, Spider).
- We are not implementing a mobile or pure web version (Electron-only for v1).

## Decisions

**1. Pure TypeScript Game Engine (No Undo, Manual Surrender)**
We are decoupling the game logic from the Vue component tree into a standalone TypeScript module (`CanfieldEngine.ts`). 
- *Rationale:* This enables us to achieve >80% unit test coverage using Vitest. We decided against an Undo system and Auto-Dead-End detection to keep the engine logic lightweight and enforce a challenging puzzle experience.

**2. Native HTML5 Drag and Drop & Double-Click**
We are using the browser's native `draggable="true"` API and a double-click auto-move handler.
- *Rationale:* Native HTML5 gives us lightweight control over overlapping drop zones. Double-clicking to auto-move to Foundations prevents tedious dragging.

**3. `electron-store` for Preferences, Auto-Save, and Statistics**
We will persist user preferences (assets, draw rules), the serialized `GameState` (auto-save), and the Global Statistics (Wins/Losses) using `electron-store`.
- *Rationale:* `electron-store` provides a unified, persistent data layer in the OS AppData folder. It securely handles local file paths for custom assets, seamlessly resumes game states, and reliably persists lifetime player statistics.

**4. Explicit Stock Redealing & Window Constraints**
We will enforce an explicit click on a "recycle" icon to redeal an empty stock, and we will enforce a strict minimum window size in Electron.
- *Rationale:* Prevents jarring auto-redealing and guarantees the complex 7-column horizontal layout never breaks due to aggressive window shrinking.

## Risks / Trade-offs

- [Risk] **Native HTML5 Drag Ghosting** → The native drag ghost image can sometimes look translucent or cut off on large stacks. Mitigation: We will implement a custom `setDragImage` fallback or CSS transforms if the native ghost is too jarring.
- [Risk] **E2E Test Flakiness** → Playwright tests involving drag-and-drop can be flaky. Mitigation: We will use precise `dragTo` coordinates and explicit waits on drop zones.
