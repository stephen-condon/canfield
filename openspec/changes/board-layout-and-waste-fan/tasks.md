## 1. Style & Layout Foundations

- [x] 1.1 Update `src/renderer/src/assets/main.css` to add `--board-max-width: 900px` and a `.centered-container` utility class
- [x] 1.2 Refactor `src/renderer/src/views/GameBoard.vue` template to wrap the HUD and `board-area` in centered containers
- [x] 1.3 Adjust `src/renderer/src/views/GameBoard.vue` CSS to ensure full-width background coverage while centering content

## 2. Waste Pile Fanning

- [x] 2.1 Update `src/renderer/src/views/GameBoard.vue` template to render up to 3 cards from the waste pile when `drawCount` is 3
- [x] 2.2 Implement scoped CSS in `GameBoard.vue` for the horizontal waste fan (right-anchored, 12px left offset per card)
- [x] 2.3 Verify that the top card remains the only draggable and double-clickable target in the fan
- [x] 2.4 Ensure the fan collapses gracefully when the waste pile has fewer than 3 cards
- [x] 2.5 Implement dynamic reordering of foundation background suit symbols to match the dealt foundation card's suit
- [x] 2.6 Update the game engine (`CanfieldEngine.ts`) to assign and strictly enforce suits for each foundation slot

## 3. Verification

- [x] 3.1 Manually verify board centering and background bleed on window resize
- [x] 3.2 Manually verify Draw 3 waste fan visual correctly shows up to 3 cards
- [x] 3.3 Run existing unit and E2E tests to ensure no regressions in game logic or layout stability
