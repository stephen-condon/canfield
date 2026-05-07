import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Preferences
  getPreferences: () => ipcRenderer.invoke('store:getPreferences'),
  setPreferences: (prefs: object) => ipcRenderer.invoke('store:setPreferences', prefs),

  // Asset Import
  importImage: (title: string) => ipcRenderer.invoke('dialog:importImage', title),

  // Statistics
  getStatistics: () => ipcRenderer.invoke('store:getStatistics'),
  recordWin: () => ipcRenderer.invoke('store:recordWin'),
  recordLoss: () => ipcRenderer.invoke('store:recordLoss'),
  resetStatistics: () => ipcRenderer.invoke('store:resetStatistics'),

  // Game Save State
  getSavedGame: () => ipcRenderer.invoke('store:getSavedGame'),
  setSavedGame: (json: string | null) => ipcRenderer.invoke('store:setSavedGame', json)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
