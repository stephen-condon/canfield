## ADDED Requirements

### Requirement: Centered Board Layout
The game board content (HUD and playing area) SHALL be horizontally centered within the application window.

#### Scenario: Centered on large screens
- **WHEN** the window width is greater than 900px
- **THEN** the board content SHALL have a maximum width of 900px and be centered with equal space on both sides

#### Scenario: Centered on small screens
- **WHEN** the window width is 900px or less
- **THEN** the board content SHALL occupy the full window width minus minimal margins

### Requirement: Board Background Visibility
The application background (felt green or custom image) SHALL be visible in the areas outside the centered board content.

#### Scenario: Background bleed
- **WHEN** the window is wider than 900px
- **THEN** the background SHALL extend to fill the entire window area beyond the 900px board content
