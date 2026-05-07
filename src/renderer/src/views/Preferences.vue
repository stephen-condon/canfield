<template>
  <div class="prefs-view">
    <div class="prefs-panel glass">
      <h2 class="title-font prefs-title">Preferences</h2>

      <!-- Draw Rule -->
      <section class="pref-section">
        <h3 class="pref-heading">Draw Rules</h3>
        <div class="draw-toggle">
          <button
            id="btn-draw1"
            class="btn btn-sm"
            :class="prefs.drawCount === 1 ? 'btn-primary' : 'btn-secondary'"
            @click="setDrawCount(1)"
          >
            Draw 1
          </button>
          <button
            id="btn-draw3"
            class="btn btn-sm"
            :class="prefs.drawCount === 3 ? 'btn-primary' : 'btn-secondary'"
            @click="setDrawCount(3)"
          >
            Draw 3
          </button>
        </div>
        <p class="pref-hint text-muted">
          Draw 1 is more forgiving. Draw 3 is traditional. Takes effect on next new game.
        </p>
      </section>

      <!-- Card Back -->
      <section class="pref-section">
        <h3 class="pref-heading">Card Back Style</h3>
        <div class="theme-row">
          <div class="theme-preview card-back-default" :class="{ active: !prefs.cardBackPath }">
            <div class="card-back-pattern" />
            <span class="theme-label">Default</span>
          </div>
          <div
            v-if="prefs.cardBackPath"
            class="theme-preview"
            :class="{ active: !!prefs.cardBackPath }"
            :style="{
              backgroundImage: `url('file://${prefs.cardBackPath}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          >
            <span class="theme-label">Custom</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button id="btn-import-cardback" class="btn btn-secondary btn-sm" @click="importCardBack">
            📁 Import Card Back
          </button>
          <button v-if="prefs.cardBackPath" class="btn btn-danger btn-sm" @click="clearCardBack">
            ✕ Reset
          </button>
        </div>
      </section>

      <!-- Background -->
      <section class="pref-section">
        <h3 class="pref-heading">Table Background</h3>
        <div class="theme-row">
          <div class="theme-preview bg-default" :class="{ active: !prefs.backgroundPath }">
            <span class="theme-label">Felt Green</span>
          </div>
          <div
            v-if="prefs.backgroundPath"
            class="theme-preview"
            :class="{ active: !!prefs.backgroundPath }"
            :style="{
              backgroundImage: `url('file://${prefs.backgroundPath}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          >
            <span class="theme-label">Custom</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button id="btn-import-bg" class="btn btn-secondary btn-sm" @click="importBackground">
            📁 Import Background
          </button>
          <button
            v-if="prefs.backgroundPath"
            class="btn btn-danger btn-sm"
            @click="clearBackground"
          >
            ✕ Reset
          </button>
        </div>
      </section>

      <button id="btn-back-prefs" class="btn btn-secondary" @click="$router.push('/')">
        ← Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'

const prefs = reactive({
  drawCount: 3 as 1 | 3,
  cardBackPath: null as string | null,
  backgroundPath: null as string | null
})

onMounted(async () => {
  if (window.api) {
    const stored = await window.api.getPreferences()
    prefs.drawCount = stored.drawCount
    prefs.cardBackPath = stored.cardBackPath
    prefs.backgroundPath = stored.backgroundPath
  }
})

async function save(): Promise<void> {
  if (window.api) await window.api.setPreferences({ ...prefs })
}

function setDrawCount(n: 1 | 3): void {
  prefs.drawCount = n
  save()
}

async function importCardBack(): Promise<void> {
  if (!window.api) return
  const path = await window.api.importImage('Choose Card Back Image')
  if (path) {
    prefs.cardBackPath = path
    save()
  }
}

function clearCardBack(): void {
  prefs.cardBackPath = null
  save()
}

async function importBackground(): Promise<void> {
  if (!window.api) return
  const path = await window.api.importImage('Choose Background Image')
  if (path) {
    prefs.backgroundPath = path
    save()
  }
}

function clearBackground(): void {
  prefs.backgroundPath = null
  save()
}
</script>

<style scoped>
.prefs-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: radial-gradient(ellipse at 60% 40%, #1a7a4a 0%, #093d24 70%);
  padding: 40px 0;
}
.prefs-panel {
  padding: 48px 56px;
  min-width: 500px;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.prefs-title {
  font-size: 32px;
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #f5c842, #fad860);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.pref-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pref-heading {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}
.pref-hint {
  font-size: 12px;
}
.draw-toggle {
  display: flex;
  gap: 8px;
}
.theme-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.theme-preview {
  width: 80px;
  height: 112px;
  border-radius: var(--card-radius);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  cursor: default;
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-fast);
}
.theme-preview.active {
  border-color: var(--color-accent);
}
.theme-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
}
.card-back-default {
  background: #1a5c85;
}
.bg-default {
  background: radial-gradient(ellipse at 60% 40%, #1a7a4a 0%, #093d24 70%);
}
</style>
