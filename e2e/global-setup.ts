/**
 * Playwright Global Setup
 *
 * Runs `npm run build` before any E2E tests execute.
 * This ensures:
 *  - TypeScript compilation errors are caught
 *  - Bundler failures (e.g. ESM/CJS mismatches) are surfaced
 *  - Tests always run against a fresh, known-good build
 *
 * If the build fails, all E2E tests are aborted with the compiler output.
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'

export default function globalSetup(): void {
  const projectRoot = resolve(__dirname, '..')

  console.log('\n🔨 Building Electron app before E2E tests...\n')

  try {
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'inherit', // stream compiler output directly so errors are readable
      timeout: 120_000 // 2-minute hard limit
    })
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    throw new Error(`❌ Build failed — E2E tests aborted.\n${detail}`)
  }

  // Sanity-check: confirm the main entry point was actually emitted
  const mainEntry = resolve(projectRoot, 'out/main/index.js')
  if (!existsSync(mainEntry)) {
    throw new Error(`❌ Build completed but expected output not found: ${mainEntry}`)
  }

  console.log('\n✅ Build succeeded. Starting E2E tests...\n')
}
