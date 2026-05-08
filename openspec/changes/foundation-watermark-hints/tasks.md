## 1. Prepare UI Components

- [x] 1.1 Add `RANK_LABELS` constant to `GameBoard.vue` script section
- [x] 1.2 Create a computed property or helper function in `GameBoard.vue` to get the label for `state.baseRank`

## 2. Implement Watermark Logic

- [x] 2.1 Update the foundation slot loop in `GameBoard.vue` template to display both rank and suit hints when a slot is empty
- [x] 2.2 Update CSS classes in `GameBoard.vue` to style the `.foundation-base-hint` as a watermark (large, centered, low opacity)

## 3. Verification

- [x] 3.1 Start a new game and verify that empty foundation slots show the correct rank and suit
- [x] 3.2 Verify that the watermark disappears when a card is placed on the foundation
- [x] 3.3 Verify that the watermark is subtle and doesn't interfere with the visual clarity of actual cards
