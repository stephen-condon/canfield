import Store from 'electron-store'

export interface Preferences {
  drawCount: 1 | 3
  cardBackPath: string | null // null = use built-in default
  backgroundPath: string | null // null = use built-in default
}

export interface Statistics {
  gamesPlayed: number
  wins: number
  losses: number
}

export interface StoreSchema {
  preferences: Preferences
  statistics: Statistics
  savedGame: string | null // JSON-serialised GameState
}

const defaultPreferences: Preferences = {
  drawCount: 3,
  cardBackPath: null,
  backgroundPath: null
}

const defaultStatistics: Statistics = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0
}

export const store = new Store<StoreSchema>({
  defaults: {
    preferences: defaultPreferences,
    statistics: defaultStatistics,
    savedGame: null
  }
})

// --------------- Preferences ---------------
export function getPreferences(): Preferences {
  return store.get('preferences')
}

export function setPreferences(prefs: Partial<Preferences>): void {
  store.set('preferences', { ...store.get('preferences'), ...prefs })
}

// --------------- Statistics ---------------
export function getStatistics(): Statistics {
  return store.get('statistics')
}

export function recordWin(): void {
  const stats = store.get('statistics')
  store.set('statistics', {
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins + 1,
    losses: stats.losses
  })
}

export function recordLoss(): void {
  const stats = store.get('statistics')
  store.set('statistics', {
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins,
    losses: stats.losses + 1
  })
}

export function resetStatistics(): void {
  store.set('statistics', { gamesPlayed: 0, wins: 0, losses: 0 })
}

// --------------- Saved Game ---------------
export function getSavedGame(): string | null {
  return store.get('savedGame')
}

export function setSavedGame(json: string | null): void {
  store.set('savedGame', json)
}
