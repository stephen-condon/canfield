<template>
  <div class="menu-bg" :style="bgStyle">
    <div class="menu-overlay" />
    <div class="menu-content">
      <div class="logo-block">
        <div class="logo-suit">♠</div>
        <h1 class="title-font logo-title">Canfield</h1>
        <p class="logo-sub">Solitaire</p>
      </div>

      <nav class="menu-nav glass">
        <button id="btn-new-game" class="btn btn-primary btn-lg" @click="startNewGame">
          ♦ New Game
        </button>
        <button
          id="btn-resume"
          class="btn btn-secondary btn-lg"
          :disabled="!hasSavedGame"
          @click="resumeGame"
        >
          ↩ Resume Game
        </button>
        <div class="menu-divider" />
        <button id="btn-statistics" class="btn btn-secondary" @click="$router.push('/statistics')">
          📊 Statistics
        </button>
        <button
          id="btn-preferences"
          class="btn btn-secondary"
          @click="$router.push('/preferences')"
        >
          ⚙️ Preferences
        </button>
      </nav>

      <p class="menu-footer text-muted">A game of patience and persistence</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasSavedGame = ref(false)
const backgroundPath = ref<string | null>(null)

onMounted(async () => {
  if (window.api) {
    const savedGame = await window.api.getSavedGame()
    hasSavedGame.value = !!savedGame
    const prefs = await window.api.getPreferences()
    backgroundPath.value = prefs.backgroundPath
  }
})

const bgStyle = computed(() => {
  if (backgroundPath.value) {
    return { backgroundImage: `url('file://${backgroundPath.value}')` }
  }
  return {}
})

async function startNewGame(): Promise<void> {
  // Clear saved game first
  if (window.api) await window.api.setSavedGame(null)
  router.push('/game?new=1')
}

function resumeGame(): void {
  router.push('/game')
}
</script>

<style scoped>
.menu-bg {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg);
  background-image: radial-gradient(ellipse at 60% 40%, #1a7a4a 0%, #093d24 70%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.menu-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(9, 61, 36, 0.4) 0%,
    rgba(9, 61, 36, 0.85) 100%
  );
  pointer-events: none;
}

.menu-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.logo-block {
  text-align: center;
}

.logo-suit {
  font-size: 72px;
  line-height: 1;
  filter: drop-shadow(0 4px 16px rgba(245, 200, 66, 0.4));
  color: var(--color-accent);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.logo-title {
  font-size: 64px;
  letter-spacing: 0.06em;
  line-height: 1;
  background: linear-gradient(135deg, #f5c842, #fad860, #f5c842);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 2px 12px rgba(245, 200, 66, 0.3));
}

.logo-sub {
  font-size: 18px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 36px 48px;
  min-width: 320px;
  align-items: stretch;
}

.menu-divider {
  height: 1px;
  background: var(--color-border);
  margin: 4px 0;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

.menu-footer {
  font-size: 13px;
  letter-spacing: 0.08em;
}
</style>
