## Context

The current `GameBoard.vue` uses a fluid flexbox layout that expands to the full window width. This causes the card zones to drift apart on large displays, which is suboptimal for a desktop application. Additionally, the Draw 3 waste pile only shows the single top card, which is technically correct for gameplay (only top is playable) but lacks the visual feedback common in solitaire games.

## Goals / Non-Goals

**Goals:**
- Implement a 900px fixed-width centered layout for the play area.
- Implement a horizontal card fan for the waste pile in Draw 3 mode.
- Ensure the HUD matches the board centering.
- Maintain full responsiveness for windows smaller than 900px (graceful shrinking).

**Non-Goals:**
- Mobile or tablet layout support.
- Changing game engine rules.
- Vertical fanning of waste.

## Decisions

### 1. Board Centering Strategy
**Decision:** Use a `max-width: 900px` container with `margin: 0 auto` for both the HUD and the main board area.
**Rationale:** Simple, standard CSS approach that ensures the play area remains compact while allowing the background to fill the remaining window space.
**Alternatives:** Centering the entire `board-root` with padding (harder to manage with full-width backgrounds).

### 2. Waste Fan Implementation
**Decision:** Render the top 3 cards of the waste pile using absolute positioning within the waste slot. The top card (last in the array) will be anchored at `right: 0`, and the cards below it will be offset by `12px` to the left per card index.
**Rationale:** Keeps the playable card in a predictable location. Using `right: 0` ensures that as cards are removed (moved to tableau/foundation), the playable card doesn't "jump" positions.
**Alternatives:** 
- Fanning to the right: This would move the playable card position as the fan grows, which is bad for UX.
- Flexbox with negative margins: Harder to control precise "peeking" behavior.

### 3. Graceful Collapse
**Decision:** If the waste pile has 1 or 2 cards, only those are rendered. No placeholders for the 3rd card.
**Rationale:** Keeps the UI clean and accurately represents the physical state of the waste.

### 4. Dynamic Foundation Suit Hints & Enforcement
**Decision:** The `GameState` will be extended to include `foundationSuits: Suit[]`. This array defines the suit assigned to each of the four foundation slots.
- **Assignment:** `Slot 0` is assigned the suit of the first card dealt. `Slots 1-3` are assigned the remaining suits in a fixed cycle (from `SUITS`).
- **Enforcement:** The `canPlaceOnFoundation` logic will be updated to require that any card (including the `baseRank` card on an empty pile) must match the slot's assigned suit.
- **Visuals:** `GameBoard.vue` will render the background suit symbols based on this `foundationSuits` array.
**Rationale:** Provides a consistent mapping between visual hints and game rules, preventing illegal moves and ensuring a clear win path.

## Risks / Trade-offs

- **[Risk] Drag and Drop Offset:** Absolute positioning in a fan might complicate drag coordinates. 
- **[Mitigation]** Use the existing native D&D which handles element-relative offsets naturally. Ensure the `z-index` of the top card is highest so it is the primary drag target.
- **[Risk] Foundation Overlap:** If the board is too narrow, the fanned waste might get close to the foundations. 
- **[Mitigation]** The 900px width provides ample space (~110px for the waste zone vs ~80px for standard slots).
