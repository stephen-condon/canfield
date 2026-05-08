## Why

Canfield Solitaire starts with a foundation card of a random rank. All other foundations must start with that same rank. Currently, empty foundation slots only show a faint suit symbol, which doesn't help the player remember the required starting rank. This change introduces a "watermark" hint showing both the suit and the rank needed to start each foundation.

## What Changes

- Update empty foundation slots to display both the required starting rank and the assigned suit.
- Ensure the hint is visually distinct from actual cards (e.g., lower opacity, "watermark" style).

## Capabilities

### New Capabilities
- `foundation-watermark`: Displays rank and suit hints in empty foundation slots.

### Modified Capabilities
- `game-board-ui`: Update foundation rendering logic to include rank hints.

## Impact

- `GameBoard.vue`: Main UI update for foundation slots.
