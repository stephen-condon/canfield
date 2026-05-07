<template>
  <div class="stats-view">
    <div class="stats-panel glass">
      <h2 class="title-font stats-title">Statistics</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">🎮</span>
          <span class="stat-value">{{ stats.gamesPlayed }}</span>
          <span class="stat-label text-muted">Games Played</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🏆</span>
          <span class="stat-value text-accent">{{ stats.wins }}</span>
          <span class="stat-label text-muted">Wins</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">💀</span>
          <span class="stat-value">{{ stats.losses }}</span>
          <span class="stat-label text-muted">Losses</span>
        </div>
        <div class="stat-card stat-card-wide">
          <span class="stat-icon">📈</span>
          <span class="stat-value" :class="winPctClass">{{ winPct }}%</span>
          <span class="stat-label text-muted">Win Rate</span>
        </div>
      </div>

      <div class="stats-actions">
        <button id="btn-reset-stats" class="btn btn-danger btn-sm" @click="confirmReset">
          🗑 Reset Statistics
        </button>
        <button id="btn-back-stats" class="btn btn-secondary btn-sm" @click="$router.push('/')">
          ← Back
        </button>
      </div>

      <transition name="fade">
        <div v-if="showConfirm" class="confirm-overlay">
          <div class="confirm-box glass">
            <p>Reset all statistics? This cannot be undone.</p>
            <div class="flex gap-3 justify-center">
              <button class="btn btn-danger btn-sm" @click="doReset">Yes, Reset</button>
              <button class="btn btn-secondary btn-sm" @click="showConfirm = false">Cancel</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const stats = ref({ gamesPlayed: 0, wins: 0, losses: 0 })
const showConfirm = ref(false)

onMounted(async () => {
  if (window.api) stats.value = await window.api.getStatistics()
})

const winPct = computed(() => {
  if (stats.value.gamesPlayed === 0) return 0
  return Math.round((stats.value.wins / stats.value.gamesPlayed) * 100)
})

const winPctClass = computed(() => (winPct.value >= 50 ? 'text-accent' : ''))

function confirmReset(): void {
  showConfirm.value = true
}

async function doReset(): Promise<void> {
  if (window.api) {
    await window.api.resetStatistics()
    stats.value = await window.api.getStatistics()
  }
  showConfirm.value = false
}
</script>

<style scoped>
.stats-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 60% 40%, #1a7a4a 0%, #093d24 70%);
}
.stats-panel {
  padding: 48px 64px;
  min-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}
.stats-title {
  font-size: 36px;
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #f5c842, #fad860);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px 16px;
}
.stat-card-wide {
  grid-column: 1 / -1;
}
.stat-icon {
  font-size: 24px;
}
.stat-value {
  font-size: 40px;
  font-weight: 700;
}
.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stats-actions {
  display: flex;
  gap: 12px;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
}
.confirm-box {
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
