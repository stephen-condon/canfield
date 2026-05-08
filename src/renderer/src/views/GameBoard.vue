<template>
  <div class="board-root" :style="boardStyle">
    <div class="board-bg-overlay" />

    <!-- HUD -->
    <header class="hud glass centered-container">
      <button class="btn btn-secondary btn-sm" @click="$router.push('/')">☰ Menu</button>
      <div class="hud-center">
        <span class="hud-stat">⏱ {{ timeLabel }}</span>
        <span class="hud-divider">|</span>
        <span class="hud-stat">🃏 {{ state.moves }} moves</span>
      </div>
      <button id="btn-surrender" class="btn btn-danger btn-sm" @click="confirmSurrender = true">
        🏳 Surrender
      </button>
    </header>

    <!-- Main Game Area -->
    <main class="board-area centered-container">
      <!-- Top Row: Reserve | gap | Foundations | gap | Stock+Waste -->
      <div class="board-top-row">
        <!-- Reserve -->
        <div class="zone-group">
          <div
            class="card-slot zone-label"
            @dragover.prevent
            @drop="onDropToTableauEmpty(-1, 'reserve')"
          >
            <template v-if="state.reserve.length > 0">
              <PlayingCard
                :card="state.reserve[state.reserve.length - 1]"
                :draggable="true"
                :card-back-path="cardBackPath"
                :z-index="10"
                @drag-start="onDragStart(state.reserve[state.reserve.length - 1], 'reserve')"
                @dbl-click="onDblClick(state.reserve[state.reserve.length - 1], 'reserve')"
              />
            </template>
            <template v-else>
              <span>🃏</span>
            </template>
          </div>
          <span class="zone-caption text-muted">Reserve ({{ state.reserve.length }})</span>
        </div>

        <div class="top-spacer" />

        <!-- Foundations (4) -->
        <div class="zone-group">
          <div class="foundations-row">
            <div
              v-for="(pile, fi) in state.foundations"
              :key="fi"
              class="card-slot foundation-slot"
              :class="{ 'drop-active': activeDropZone === `foundation_${fi}` }"
              @dragover.prevent="activeDropZone = `foundation_${fi}`"
              @dragleave="activeDropZone = null"
              @drop="onDropToFoundation(fi)"
            >
              <PlayingCard
                v-if="pile.length > 0"
                :card="pile[pile.length - 1]"
                :draggable="false"
                :z-index="10"
              />
              <div v-else class="foundation-base-hint text-muted">
                <div class="hint-rank">{{ baseRankLabel }}</div>
                <div class="hint-suit">{{ dynamicFoundationSuits[fi] }}</div>
              </div>
            </div>
          </div>
          <span class="zone-caption text-muted">Foundations</span>
        </div>

        <div class="top-spacer" />

        <!-- Stock + Waste -->
        <div class="zone-group">
          <div class="stock-waste-row">
            <!-- Stock -->
            <div id="zone-stock" class="card-slot" style="cursor: pointer" @click="onClickStock">
              <template v-if="state.stock.length > 0">
                <PlayingCard
                  :card="state.stock[state.stock.length - 1]"
                  :draggable="false"
                  :card-back-path="cardBackPath"
                  :z-index="10"
                  style="cursor: pointer"
                />
              </template>
              <template v-else>
                <!-- Redeal icon -->
                <span class="redeal-icon" title="Click to redeal">↺</span>
              </template>
            </div>

            <!-- Waste -->
            <div
              class="card-slot waste-slot"
              :class="{ 'drop-active': activeDropZone === 'waste' }"
              @dragover.prevent="activeDropZone = 'waste'"
              @dragleave="activeDropZone = null"
            >
              <template v-for="(card, index) in visibleWaste" :key="card.id">
                <div :style="getWasteFanStyle(index, visibleWaste.length)">
                  <PlayingCard
                    :card="card"
                    :draggable="index === visibleWaste.length - 1"
                    :z-index="10 + index"
                    @drag-start="onDragStart(card, 'waste')"
                    @dbl-click="
                      index === visibleWaste.length - 1 ? onDblClick(card, 'waste') : null
                    "
                  />
                </div>
              </template>
            </div>
          </div>
          <span class="zone-caption text-muted">Stock / Waste</span>
        </div>
      </div>

      <!-- Tableau (4 columns) -->
      <div class="tableau-row">
        <div
          v-for="(column, ci) in state.tableau"
          :key="ci"
          class="tableau-col"
          :class="{ 'drop-active': activeDropZone === `tableau_${ci}` }"
          :style="{ minHeight: colMinHeight(column) }"
          @dragover.prevent="activeDropZone = `tableau_${ci}`"
          @dragleave="activeDropZone = null"
          @drop="onDropToTableau(ci)"
        >
          <div v-if="column.length === 0" class="card-slot tableau-empty-slot">
            <span v-if="state.reserve.length > 0" class="text-muted" style="font-size: 22px">
              ♦
            </span>
          </div>
          <div
            v-for="(card, cardIdx) in column"
            :key="card.id"
            class="tableau-card-wrapper"
            :style="{ top: `${cardIdx * tableauOffset}px`, zIndex: cardIdx + 1 }"
          >
            <PlayingCard
              :card="card"
              :draggable="card.faceUp"
              :card-back-path="cardBackPath"
              :z-index="cardIdx + 1"
              @drag-start="onDragStartTableau(card, ci, cardIdx)"
              @dbl-click="onDblClick(card, `tableau_${ci}`)"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Win Overlay -->
    <WinOverlay
      v-if="state.won"
      :moves="state.moves"
      :elapsed-ms="state.elapsedMs"
      @play-again="startNew"
      @main-menu="$router.push('/')"
    />

    <!-- Surrender confirm -->
    <transition name="fade">
      <div v-if="confirmSurrender" class="confirm-overlay">
        <div class="confirm-box glass">
          <p>Surrender this game? It will count as a loss.</p>
          <div class="flex gap-3 justify-center">
            <button class="btn btn-danger btn-sm" @click="doSurrender">Yes, Surrender</button>
            <button class="btn btn-secondary btn-sm" @click="confirmSurrender = false">
              Keep Playing
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PlayingCard from '../components/PlayingCard.vue'
import WinOverlay from '../components/WinOverlay.vue'
import {
  newGame,
  drawFromStock,
  redealStock,
  moveToFoundation,
  moveTableauToTableau,
  moveToTableau,
  autoMoveToFoundation,
  serialise,
  deserialise
} from '../engine/CanfieldEngine'
import type { GameState, Card, ZoneId, Suit } from '../engine/types'

const router = useRouter()
const route = useRoute()

const SUIT_MAP: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
}

const RANK_LABELS: Record<number, string> = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K'
}

// ---- State ----
const state = ref<GameState>(newGame(3))
const cardBackPath = ref<string | null>(null)
const confirmSurrender = ref(false)
const activeDropZone = ref<string | null>(null)

const baseRankLabel = computed(() => RANK_LABELS[state.value.baseRank] ?? String(state.value.baseRank))

// Drag tracking
let dragSourceZone: ZoneId | null = null
let dragFromTableauCol: number | null = null
let dragFromTableauIdx: number | null = null

// Timer
let timerInterval: ReturnType<typeof setInterval> | null = null
let startTimestamp = Date.now()

const tableauOffset = 28 // px

// ---- Init ----
onMounted(async () => {
  if (window.api) {
    const prefs = await window.api.getPreferences()
    cardBackPath.value = prefs.cardBackPath

    if (route.query.new === '1') {
      const fresh = newGame(prefs.drawCount)
      state.value = fresh
      await window.api.setSavedGame(serialise(fresh))
    } else {
      const saved = await window.api.getSavedGame()
      if (saved) {
        const loaded = deserialise(saved)
        state.value = loaded
        startTimestamp = Date.now() - loaded.elapsedMs
      } else {
        const fresh = newGame(prefs.drawCount)
        state.value = fresh
        await window.api.setSavedGame(serialise(fresh))
      }
    }
  }
  if (state.value.won) {
    onWin()
  }
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})

// ---- Timer ----
function startTimer(): void {
  startTimestamp = Date.now() - state.value.elapsedMs
  timerInterval = setInterval(() => {
    if (!state.value.won) {
      state.value.elapsedMs = Date.now() - startTimestamp
    }
  }, 1000)
}

function stopTimer(): void {
  if (timerInterval) clearInterval(timerInterval)
}

const timeLabel = computed(() => {
  const s = Math.floor(state.value.elapsedMs / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
})

// ---- Computed ----
const boardStyle = computed(() => ({
  backgroundImage: undefined
}))

function colMinHeight(column: Card[]): string {
  const cards = column.length
  if (cards === 0) return '112px'
  return `${(cards - 1) * tableauOffset + 112}px`
}

const visibleWaste = computed(() => {
  if (state.value.drawCount === 1) {
    return state.value.waste.slice(-1)
  }
  return state.value.waste.slice(-3)
})

function getWasteFanStyle(index: number, total: number): Record<string, string> {
  if (state.value.drawCount === 1 || total <= 1) return {}
  const offset = (total - 1 - index) * 12
  return {
    position: 'absolute',
    right: `${offset}px`,
    zIndex: String(10 + index)
  }
}

const dynamicFoundationSuits = computed(() => {
  return state.value.foundationSuits.map((s) => SUIT_MAP[s])
})

// ---- Save helper ----
async function save(): Promise<void> {
  if (window.api && !state.value.won) {
    await window.api.setSavedGame(serialise(state.value))
  }
}

// ---- Stock ----
async function onClickStock(): Promise<void> {
  if (state.value.stock.length > 0) {
    const next = drawFromStock(state.value)
    if (next) {
      state.value = next
      await save()
    }
  } else {
    const next = redealStock(state.value)
    if (next) {
      state.value = next
      await save()
    }
  }
}

// ---- Drag ----
function onDragStart(_card: Card, zone: ZoneId): void {
  dragSourceZone = zone
  dragFromTableauCol = null
  dragFromTableauIdx = null
}

function onDragStartTableau(_card: Card, col: number, cardIdx: number): void {
  dragSourceZone = `tableau_${col}` as ZoneId
  dragFromTableauCol = col
  dragFromTableauIdx = cardIdx
}

async function onDropToFoundation(fi: number): Promise<void> {
  activeDropZone.value = null
  if (!dragSourceZone) return
  const next = moveToFoundation(state.value, dragSourceZone, fi)
  if (next) {
    state.value = next
    if (next.won) {
      await onWin()
    } else {
      await save()
    }
  }
  dragSourceZone = null
}

async function onDropToTableau(toCol: number): Promise<void> {
  activeDropZone.value = null
  if (!dragSourceZone) return
  let next: GameState | null = null
  if (
    dragSourceZone.startsWith('tableau_') &&
    dragFromTableauCol !== null &&
    dragFromTableauIdx !== null
  ) {
    next = moveTableauToTableau(state.value, dragFromTableauCol, dragFromTableauIdx, toCol)
  } else {
    next = moveToTableau(state.value, dragSourceZone, toCol)
  }
  if (next) {
    state.value = next
    await save()
  }
  dragSourceZone = null
  dragFromTableauCol = null
  dragFromTableauIdx = null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onDropToTableauEmpty(_col: number, _zone: string): void {
  // handled by onDropToTableau(-1) for reserve special case — not used
}

// ---- Double-click auto-move ----
async function onDblClick(_card: Card, zone: ZoneId): Promise<void> {
  const next = autoMoveToFoundation(state.value, zone)
  if (next) {
    state.value = next
    if (next.won) {
      await onWin()
    } else {
      await save()
    }
  }
}

// ---- Win ----
async function onWin(): Promise<void> {
  stopTimer()
  if (window.api) {
    console.log('Recording win...')
    await window.api.recordWin()
    await window.api.setSavedGame(null)
    console.log('Win recorded and save cleared.')
  }
}

// ---- Surrender ----
async function doSurrender(): Promise<void> {
  confirmSurrender.value = false
  stopTimer()
  if (window.api) {
    console.log('Recording surrender as loss...')
    await window.api.recordLoss()
    await window.api.setSavedGame(null)
    console.log('Loss recorded.')
  }
  router.push('/')
}

// ---- New Game ----
async function startNew(): Promise<void> {
  let drawCount: 1 | 3 = 3
  if (window.api) {
    const prefs = await window.api.getPreferences()
    drawCount = prefs.drawCount
  }
  const fresh = newGame(drawCount)
  state.value = fresh
  await save()
  startTimer()
}
</script>

<style scoped>
.board-root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 60% 40%, #1a7a4a 0%, #093d24 70%);
  overflow: hidden;
}
.board-bg-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 60% 40%,
    rgba(26, 122, 74, 0.2) 0%,
    rgba(9, 61, 36, 0.6) 100%
  );
}

/* HUD */
.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  margin-top: 12px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}
.hud-center {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hud-stat {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.hud-divider {
  color: var(--color-border);
}

/* Board Area */
.board-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 20px 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Top Row */
.board-top-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
}
.top-spacer {
  flex: 1;
}
.zone-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.zone-caption {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.foundations-row {
  display: flex;
  gap: 8px;
}
.foundation-slot {
  position: relative;
}
.foundation-base-hint {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.15;
  pointer-events: none;
  user-select: none;
}
.hint-rank {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}
.hint-suit {
  font-size: 24px;
  line-height: 1;
}
.stock-waste-row {
  display: flex;
  gap: 8px;
}
.waste-slot {
  position: relative;
}
.redeal-icon {
  font-size: 36px;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: color var(--transition-fast);
}
.redeal-icon:hover {
  color: var(--color-accent);
}

/* Tableau */
.tableau-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
}
.tableau-col {
  position: relative;
  flex: 1;
  min-width: var(--card-width);
}
.tableau-empty-slot {
  position: absolute;
  top: 0;
  left: 0;
}
.tableau-card-wrapper {
  position: absolute;
  left: 0;
}

/* Confirm overlay */
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
