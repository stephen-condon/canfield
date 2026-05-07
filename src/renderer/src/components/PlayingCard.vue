<template>
  <div
    class="playing-card"
    :class="{
      'face-down': !card.faceUp,
      dragging: isDragging,
      'drop-active': isDropTarget
    }"
    :draggable="draggable && card.faceUp"
    :style="cardStyle"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dblclick="onDblClick"
  >
    <template v-if="card.faceUp">
      <div class="card-corner" :class="colorClass">
        <span>{{ rankLabel }}</span>
        <span class="card-suit-label">{{ suitSymbol }}</span>
      </div>
      <div class="card-center-suit" :class="colorClass">{{ suitSymbol }}</div>
      <div class="card-corner-bottom" :class="colorClass">
        <span>{{ rankLabel }}</span>
        <span class="card-suit-label">{{ suitSymbol }}</span>
      </div>
    </template>
    <template v-else>
      <div class="card-back-pattern" :style="backStyle" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, suitColor } from '../engine/types'

interface Props {
  card: Card
  draggable?: boolean
  isDragging?: boolean
  isDropTarget?: boolean
  zIndex?: number
  cardBackPath?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  draggable: false,
  isDragging: false,
  isDropTarget: false,
  zIndex: 0,
  cardBackPath: null
})

const emit = defineEmits<{
  (e: 'drag-start', card: Card): void
  (e: 'dbl-click', card: Card): void
}>()

const RANK_LABELS: Record<number, string> = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K'
}
const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
}

const rankLabel = computed(() => RANK_LABELS[props.card.rank] ?? String(props.card.rank))
const suitSymbol = computed(() => SUIT_SYMBOLS[props.card.suit])
const colorClass = computed(() =>
  suitColor(props.card.suit) === 'red' ? 'rank-red' : 'rank-black'
)

const cardStyle = computed(() => ({
  zIndex: props.zIndex
}))

const backStyle = computed(() => {
  if (props.cardBackPath) {
    return {
      backgroundImage: `url('file://${props.cardBackPath}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {}
})

function onDragStart(e: DragEvent): void {
  if (!props.card.faceUp) {
    e.preventDefault()
    return
  }
  e.dataTransfer?.setData('text/plain', props.card.id)
  emit('drag-start', props.card)
}

function onDragEnd(): void {
  // handled by parent
}

function onDblClick(): void {
  if (props.card.faceUp) emit('dbl-click', props.card)
}
</script>
