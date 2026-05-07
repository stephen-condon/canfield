<template>
  <div class="confetti-overlay">
    <canvas ref="canvas" class="confetti-canvas" />
    <div class="win-box glass">
      <div class="win-trophy">🏆</div>
      <h2 class="title-font win-title">You Win!</h2>
      <p class="win-stats text-muted">{{ moves }} moves &nbsp;·&nbsp; {{ timeLabel }}</p>
      <button id="btn-play-again" class="btn btn-primary btn-lg" @click="$emit('play-again')">
        ♦ Play Again
      </button>
      <button class="btn btn-secondary btn-sm" @click="$emit('main-menu')">↩ Main Menu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ moves: number; elapsedMs: number }>()
defineEmits(['play-again', 'main-menu'])

const canvas = ref<HTMLCanvasElement | null>(null)
let animFrame = 0

const COLORS = ['#f5c842', '#4caf7d', '#e05252', '#5b9cf5', '#e07df0', '#fad860']

interface Particle {
  x: number
  y: number
  r: number
  color: string
  vx: number
  vy: number
  angle: number
  spin: number
  opacity: number
}

const particles: Particle[] = []

function spawnParticles(w: number): void {
  for (let i = 0; i < 160; i++) {
    particles.push({
      x: Math.random() * w,
      y: -10,
      r: Math.random() * 6 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      opacity: 1
    })
  }
}

function tick(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.clearRect(0, 0, w, h)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.angle += p.spin
    p.opacity -= 0.004
    if (p.y > h || p.opacity <= 0) {
      particles.splice(i, 1)
      continue
    }
    ctx.save()
    ctx.globalAlpha = p.opacity
    ctx.translate(p.x, p.y)
    ctx.rotate(p.angle)
    ctx.fillStyle = p.color
    ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r)
    ctx.restore()
  }
  if (particles.length > 0) {
    animFrame = requestAnimationFrame(() => tick(ctx, w, h))
  }
}

onMounted(() => {
  const c = canvas.value!
  c.width = window.innerWidth
  c.height = window.innerHeight
  const ctx = c.getContext('2d')!
  spawnParticles(c.width)
  // Burst in waves
  setTimeout(() => spawnParticles(c.width), 600)
  setTimeout(() => spawnParticles(c.width), 1200)
  tick(ctx, c.width, c.height)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrame)
})

const timeLabel = (() => {
  const s = Math.floor(props.elapsedMs / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
})()
</script>

<style scoped>
.confetti-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}
.confetti-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
.win-box {
  position: relative;
  z-index: 1;
  padding: 48px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}
.win-trophy {
  font-size: 72px;
  animation: bounce 0.6s ease-in-out infinite alternate;
}
@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-12px);
  }
}
.win-title {
  font-size: 48px;
  background: linear-gradient(135deg, #f5c842, #fad860);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.win-stats {
  font-size: 16px;
}
</style>
