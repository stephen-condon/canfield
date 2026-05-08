## ADDED Requirements

### Requirement: Foundation Rank Hint
The system SHALL display the required starting rank (the base rank) in empty foundation slots.

#### Scenario: Empty foundation displays rank
- **WHEN** a foundation slot is empty
- **THEN** it displays the rank label corresponding to the game's `baseRank` (e.g., "A", "7", "K")

### Requirement: Foundation Suit Hint
The system SHALL display the assigned suit in empty foundation slots.

#### Scenario: Empty foundation displays suit
- **WHEN** a foundation slot is empty
- **THEN** it displays the symbol for its assigned suit (e.g., "♥", "♣")

### Requirement: Watermark Styling
The foundation hints SHALL be styled as a low-opacity watermark to distinguish them from actual cards.

#### Scenario: Hint styling
- **WHEN** a foundation hint is displayed
- **THEN** it is rendered with low opacity and centered in the card slot
