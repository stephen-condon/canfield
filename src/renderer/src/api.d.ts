// Type shims for the `window.api` IPC bridge exposed by preload
export interface CanfieldAPI {
  getPreferences: () => Promise<{
    drawCount: 1 | 3
    cardBackPath: string | null
    backgroundPath: string | null
  }>
  setPreferences: (prefs: object) => Promise<void>
  importImage: (title: string) => Promise<string | null>
  getStatistics: () => Promise<{ gamesPlayed: number; wins: number; losses: number }>
  recordWin: () => Promise<void>
  recordLoss: () => Promise<void>
  resetStatistics: () => Promise<void>
  getSavedGame: () => Promise<string | null>
  setSavedGame: (json: string | null) => Promise<void>
}

declare global {
  interface Window {
    api: CanfieldAPI
  }
}
