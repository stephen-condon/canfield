## ADDED Requirements

### Requirement: Dynamic Foundation Suit Hints
Each foundation slot SHALL display a background suit symbol that corresponds to the suit assigned to that slot.

#### Scenario: Slot 0 matches first card
- **WHEN** a new game starts
- **THEN** Slot 0 (the pre-filled foundation) SHALL have its background hint symbol set to the suit of the first dealt card

#### Scenario: Remaining slots show other suits
- **WHEN** a new game starts
- **THEN** Slots 1, 2, and 3 SHALL show the three suits that were not dealt to Slot 0, in a consistent order

### Requirement: Foundation Suit Enforcement
The system SHALL strictly enforce that cards can only be placed in a foundation slot if their suit matches the slot's background hint symbol.

#### Scenario: Dropping on matching slot
- **WHEN** a player drags a card of `baseRank` to an empty foundation slot with a matching background suit symbol
- **THEN** the system SHALL allow the move

#### Scenario: Dropping on mismatched slot
- **WHEN** a player drags a card of `baseRank` to an empty foundation slot with a different background suit symbol
- **THEN** the system SHALL reject the move
