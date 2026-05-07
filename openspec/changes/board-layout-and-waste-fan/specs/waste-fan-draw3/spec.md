## ADDED Requirements

### Requirement: Draw 3 Waste Fanning
When Draw 3 mode is enabled, the waste pile SHALL display up to three cards in a horizontal fan.

#### Scenario: Three cards in waste
- **WHEN** Draw 3 mode is active and the waste pile contains 3 or more cards
- **THEN** the system SHALL render the top card at the rightmost position and two preceding cards fanned to the left

#### Scenario: Two cards in waste
- **WHEN** Draw 3 mode is active and the waste pile contains exactly 2 cards
- **THEN** the system SHALL render the top card at the rightmost position and one preceding card fanned to the left

#### Scenario: One card in waste
- **WHEN** Draw 3 mode is active and the waste pile contains exactly 1 card
- **THEN** the system SHALL render only the top card at the rightmost position with no fan

### Requirement: Fan Visual Offset
The cards in the waste fan SHALL have a fixed horizontal offset to ensure peeking visibility.

#### Scenario: Horizontal offset
- **WHEN** multiple cards are displayed in the waste fan
- **THEN** each card below the top card SHALL be offset to the left by exactly 12px relative to the card above it

### Requirement: Top Card Anchor
The playable (top) card in the waste pile SHALL maintain a consistent horizontal anchor point regardless of the fan size.

#### Scenario: Consistent anchor
- **WHEN** the waste pile size changes (e.g., after drawing or moving a card)
- **THEN** the horizontal right-side position of the top card SHALL remain unchanged
