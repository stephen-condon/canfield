import { test, expect, _electron as electron } from '@playwright/test'
import { ElectronApplication, Page } from '@playwright/test'
import path from 'path'

let electronApp: ElectronApplication
let page: Page

test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: [path.join(__dirname, '../out/main/index.js')],
    env: { ...process.env, NODE_ENV: 'production' }
  })
  page = await electronApp.firstWindow()
  await page.waitForLoadState('domcontentloaded')
})

test.afterAll(async () => {
  await electronApp.close()
})

test('E2E-1: App launches and shows Main Menu', async () => {
  await expect(page.locator('#btn-new-game')).toBeVisible()
  await expect(page.locator('#btn-statistics')).toBeVisible()
  await expect(page.locator('#btn-preferences')).toBeVisible()
})

test('E2E-2: New game starts and shows game board with HUD', async () => {
  await page.click('#btn-new-game')
  await page.waitForTimeout(500)

  // HUD should have timer and moves
  await expect(page.locator('.hud-stat').first()).toBeVisible()
  await expect(page.locator('#btn-surrender')).toBeVisible()
  // Stock should be present
  await expect(page.locator('#zone-stock')).toBeVisible()
})

test('E2E-3: Draw from stock moves a card to waste', async () => {
  // We're on the game board from previous test
  await page.click('#zone-stock')
  await page.waitForTimeout(300)
  // After clicking stock, waste pile should have a card (face-up playing card)
  const wasteCard = page.locator('.waste-slot .playing-card')
  await expect(wasteCard).toBeVisible()
})

test('E2E-4: Statistics screen shows stats', async () => {
  // Navigate back to main menu then to statistics
  await page.click('.hud .btn-secondary') // Menu button
  await page.waitForTimeout(300)
  await page.click('#btn-statistics')
  await page.waitForTimeout(300)
  await expect(page.locator('#btn-reset-stats')).toBeVisible()
  await expect(page.locator('.stat-value').first()).toBeVisible()
  await page.click('#btn-back-stats')
})
