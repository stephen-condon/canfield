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
  const currentPlayed = store.get('statistics.gamesPlayed', 0)
  const currentWins = store.get('statistics.wins', 0)
  
  store.set('statistics.gamesPlayed', currentPlayed + 1)
  store.set('statistics.wins', currentWins + 1)
}

export function recordLoss(): void {
  const currentPlayed = store.get('statistics.gamesPlayed', 0)
  const currentLosses = store.get('statistics.losses', 0)
  
  store.set('statistics.gamesPlayed', currentPlayed + 1)
  store.set('statistics.losses', currentLosses + 1)
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
