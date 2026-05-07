## ADDED Requirements

### Requirement: Preferences Screen
The system SHALL provide a Preferences screen accessible from the Main Menu where users can manage visual themes and Draw Rules.

#### Scenario: Opening preferences
- **WHEN** the user clicks "Preferences" in the Main Menu
- **THEN** the Preferences screen is displayed showing Backgrounds, Card Backs, and the Draw Rule toggle (Draw 1 vs Draw 3).

### Requirement: In-App Asset Import
The system SHALL allow users to import custom Background and Card Back images using a native OS file picker.

#### Scenario: Importing a custom background
- **WHEN** the user clicks "Import Background"
- **THEN** an OS file dialog opens, allowing them to select an image file.

### Requirement: Persistent Configuration
The system SHALL save user preference selections, imported asset paths, and the current Auto-Save state so they persist across restarts.

#### Scenario: Restarting the app
- **WHEN** the user sets a custom card back and restarts the application
- **THEN** the application loads the custom card back automatically via `electron-store`.

### Requirement: Global Statistics View
The system SHALL maintain a global store of Wins and Losses and display them in a dedicated Statistics view.

#### Scenario: Viewing Statistics
- **WHEN** the user navigates to the Statistics screen
- **THEN** the app displays Total Games, Wins, Losses, Win Percentage, and a Reset button.
