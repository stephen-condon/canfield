## Context

The current Canfield implementation shows a suit hint in empty foundation slots, but doesn't indicate the required starting rank (the `baseRank`). This can be confusing for players who forget what rank was dealt to the first foundation.

## Goals / Non-Goals

**Goals:**
- Display a "watermark" hint in empty foundation slots.
- The hint must show both the assigned suit and the required starting rank (`baseRank`).
- The hint should be visually distinct (faint/low-opacity) to avoid confusion with playable cards.

**Non-Goals:**
- Changing the game logic for foundations (this is purely a UI enhancement).
- Adding hints to other zones like the tableau.

## Decisions

- **UI Component**: Modify `GameBoard.vue` directly rather than creating a new `FoundationHint` component, as the foundation slot logic is already embedded in `GameBoard.vue`.
- **Rank Labels**: Add a `RANK_LABELS` map in `GameBoard.vue` (consistent with `PlayingCard.vue`) to convert numerical ranks to strings (A, 2-10, J, Q, K).
- **Styling**:
  - Increase the font size of the hint.
  - Show the rank and suit together (e.g., "A♥").
  - Use `opacity: 0.15` or similar to make it look like a watermark.
  - Center the watermark within the slot.

## Risks / Trade-offs

- **Visual Clutter**: Adding more text to the board could make it look busy. 
  - *Mitigation*: Use very low opacity and a centered layout to keep it subtle.
- **Accessibility**: Low-opacity text might be hard to read.
  - *Mitigation*: Ensure the font size is large enough to be legible even at low contrast.
