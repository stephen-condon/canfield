import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  getPreferences,
  setPreferences,
  getStatistics,
  recordWin,
  recordLoss,
  resetStatistics,
  getSavedGame,
  setSavedGame
} from './store'

const MIN_WIDTH = 1100
const MIN_HEIGHT = 720

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.canfield-solitaire')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ---- IPC: Preferences ----
  ipcMain.handle('store:getPreferences', () => getPreferences())
  ipcMain.handle('store:setPreferences', (_e, prefs) => {
    setPreferences(prefs)
  })

  // ---- IPC: Asset Import ----
  ipcMain.handle('dialog:importImage', async (_e, title: string) => {
    const result = await dialog.showOpenDialog({
      title,
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'] }],
      properties: ['openFile']
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  // ---- IPC: Statistics ----
  ipcMain.handle('store:getStatistics', () => getStatistics())
  ipcMain.handle('store:recordWin', () => recordWin())
  ipcMain.handle('store:recordLoss', () => recordLoss())
  ipcMain.handle('store:resetStatistics', () => resetStatistics())

  // ---- IPC: Game State ----
  ipcMain.handle('store:getSavedGame', () => getSavedGame())
  ipcMain.handle('store:setSavedGame', (_e, json: string | null) => setSavedGame(json))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
