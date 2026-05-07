## Why

The game board currently stretches to fill the full window width, making card zones uncomfortably spread out on standard desktop monitors. The waste pile also gives no visual feedback for how many cards were drawn in Draw 3 mode, removing a key piece of information the player needs to plan moves.

## What Changes

- The game board area is constrained to a **900px maximum content width** and centered horizontally within the window. Space on either side shows the felt background naturally — no hard container or border.
- The waste pile in **Draw 3 mode** renders a horizontal fan of up to 3 cards: the top (playable) card is anchored at the rightmost position, with up to 2 older cards peeking out to the left at **12px horizontal offset each**. The fan collapses gracefully to 2 or 1 cards when fewer are in the waste.
- In **Draw 1 mode**, the waste pile renders as a single card (no change from current behaviour).
- The HUD bar matches the 900px board width and is centered consistently with the board.
- Each foundation slot displays a subtle background suit symbol matching the suit that SHALL be placed in that slot. The suits are assigned starting with the initial foundation card's suit.
- Card placement onto foundations is strictly enforced: a card can only be placed into a foundation slot if its suit matches the slot's assigned suit.

## Capabilities

### New Capabilities

- `board-centering`: Board content area constrained to 900px max-width, horizontally centered, with felt filling flanking space.
- `waste-fan-draw3`: Draw 3 waste pile renders a left-expanding horizontal card fan (top card anchored right, 12px offset, up to 3 cards, graceful collapse).

### Modified Capabilities

<!-- No existing spec-level requirements are changing — these are new visual behaviours. -->

## Impact

- `src/renderer/src/views/GameBoard.vue` — board layout CSS, HUD centering, waste pile rendering logic
- `src/renderer/src/assets/main.css` — new CSS variables/utilities for max-width centering
- No engine changes, no IPC changes, no dependency changes
