## ADDED Requirements

### Requirement: Dragging Single Cards
The system SHALL allow a user to drag a single valid card from the Reserve, Waste, or Tableau to a valid drop zone.

#### Scenario: Dragging a valid card
- **WHEN** the user clicks and drags an exposed card
- **THEN** a visual drag ghost follows the cursor and drop zones highlight.

### Requirement: Dragging Card Sequences
The system SHALL allow a user to drag an entire valid sequence of cards from one Tableau column to another.

#### Scenario: Dragging a stack
- **WHEN** the user clicks and drags a validly packed stack of cards in the Tableau
- **THEN** the entire stack moves together and can be dropped on a valid target.

### Requirement: Invalid Move Rejection
The system SHALL visually snap a dragged card/sequence back to its origin if dropped on an invalid target.

#### Scenario: Dropping on invalid target
- **WHEN** the user drops a Red King on another Red King
- **THEN** the move is rejected by the engine and the UI animates the card back to its source.
