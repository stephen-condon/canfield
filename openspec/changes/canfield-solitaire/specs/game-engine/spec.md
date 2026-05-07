## ADDED Requirements

### Requirement: Deck Generation and Shuffling
The system SHALL generate a standard 52-card deck and randomly shuffle it upon initializing a new game.

#### Scenario: New game initialization
- **WHEN** the `CanfieldEngine` is instantiated for a new game
- **THEN** it generates 52 unique cards and shuffles them randomly.

### Requirement: Initial Deal Layout
The system SHALL deal 13 cards to the Reserve (top face up), 1 card to the Foundations (base rank), 4 cards face up to the Tableau, and leave the remaining 34 cards in the Stock.

#### Scenario: Dealing the layout
- **WHEN** the deck is dealt
- **THEN** the Reserve has 13 cards, Foundation has 1, Tableau has 4 columns of 1 card each, and Stock has 34.

### Requirement: Foundation Building Rules
The system SHALL only allow cards to be placed on a Foundation pile if they match the suit of the base card and are exactly one rank higher (wrapping King to Ace).

#### Scenario: Valid foundation placement
- **WHEN** a player attempts to place the 8 of Hearts on the 7 of Hearts foundation
- **THEN** the engine validates the move as legal.

### Requirement: Tableau Building Rules
The system SHALL only allow cards to be placed on a Tableau column if they are the opposite color and exactly one rank lower (wrapping Ace to King).

#### Scenario: Valid tableau placement
- **WHEN** a player attempts to place a Black Jack on a Red Queen in the tableau
- **THEN** the engine validates the move as legal.

### Requirement: Empty Tableau Column Filling
The system SHALL force an empty Tableau column to be filled immediately by the top card of the Reserve pile if the Reserve is not empty.

#### Scenario: Auto-filling empty tableau
- **WHEN** a tableau column becomes empty and the Reserve has cards
- **THEN** the engine automatically moves the top Reserve card to the empty column.

### Requirement: Stock to Waste Rules
The system SHALL allow the player to draw from the Stock to the Waste pile based on the configured Draw Rule (1 or 3).

#### Scenario: Drawing from Stock
- **WHEN** the player interacts with the Stock pile
- **THEN** the configured number of cards are moved to the Waste pile.

### Requirement: Explicit Stock Redeal
The system SHALL NOT automatically recycle the Waste into the Stock when the Stock is empty.

#### Scenario: Recycling the Stock
- **WHEN** the Stock is empty and the player explicitly requests a redeal
- **THEN** the Waste pile is flipped to form a new Stock pile.

### Requirement: Win Condition Detection
The system SHALL detect when all 52 cards are successfully placed in the Foundations.

#### Scenario: Winning the game
- **WHEN** the final card is moved to the Foundations
- **THEN** the engine triggers a Win state and updates the Global Statistics.

### Requirement: Auto-Save Serialization
The system SHALL serialize its state to `electron-store` on every valid move.

#### Scenario: Triggering auto-save
- **WHEN** a legal move is executed
- **THEN** the `GameState` is immediately written to disk.

### Requirement: Manual Surrender
The system SHALL NOT auto-detect game-over states. The user must manually surrender.

#### Scenario: Surrendering
- **WHEN** the user explicitly triggers the surrender action
- **THEN** the engine registers a Loss and updates the Global Statistics.
