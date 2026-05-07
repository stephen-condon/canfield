## ADDED Requirements

### Requirement: Main Menu Navigation
The system SHALL display a Main Menu on application launch with options to "Start New Game", "Resume Game", "Statistics", and "Preferences".

#### Scenario: Launching the application
- **WHEN** the Electron app boots up
- **THEN** the Main Menu is displayed.

### Requirement: Game Board Rendering & HUD
The system SHALL visually render the Reserve, Foundations, Tableau, Stock, and Waste piles, along with a HUD tracking Elapsed Time and Total Moves.

#### Scenario: Viewing the game board
- **WHEN** a game is started
- **THEN** the Vue components render the exact state of the `CanfieldEngine` and the HUD metrics.

### Requirement: Responsive Scaling & Constraints
The system SHALL ensure the card layout scales responsively and enforce strict window constraints so the layout never breaks.

#### Scenario: Resizing the window
- **WHEN** the user resizes the desktop window
- **THEN** the layout adjusts until it hits the hardcoded `minWidth`/`minHeight` constraints set by Electron.

### Requirement: Victory UI
The system SHALL display a Confetti overlay and a "Play Again" button when the win condition is met.

#### Scenario: Winning the game
- **WHEN** the `CanfieldEngine` emits a win state
- **THEN** the Confetti animation triggers and the Play Again button appears.
