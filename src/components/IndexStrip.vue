<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { shelf } from '../data.js'

const scroller = ref(null)
const ratio = ref(0)
const dragging = ref(false)

let startX = 0
let startLeft = 0
let moved = false

function sync() {
  const el = scroller.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  ratio.value = max <= 0 ? 1 : el.scrollLeft / max
}

function down(event) {
  if (event.pointerType !== 'mouse' || event.button !== 0) return
  const el = scroller.value
  dragging.value = true
  moved = false
  startX = event.clientX
  startLeft = el.scrollLeft
  el.setPointerCapture(event.pointerId)
}

function move(event) {
  if (!dragging.value) return
  const dx = event.clientX - startX
  if (Math.abs(dx) > 4) moved = true
  scroller.value.scrollLeft = startLeft - dx
}

function up() {
  dragging.value = false
}

function onKey(event) {
  const amount = event.key === 'ArrowRight' ? 340 : event.key === 'ArrowLeft' ? -340 : 0
  if (!amount) return
  event.preventDefault()
  scroller.value.scrollBy({ left: amount, behavior: 'smooth' })
}

function step(direction) {
  scroller.value.scrollBy({ left: direction * 340, behavior: 'smooth' })
}

onMounted(() => {
  const el = scroller.value
  el.addEventListener('scroll', sync, { passive: true })
  sync()
})

onUnmounted(() => {
  const el = scroller.value
  el?.removeEventListener('scroll', sync)
})
</script>

<template>
  <section aria-labelledby="shelf-title">
    <div class="shelf-head wrap" data-reveal>
      <p class="eyebrow">05 — The shelf</p>
      <h2 id="shelf-title">The work, kept in order.</h2>
      <div class="shelf-controls">
        <p class="drag-note">Drag across</p>
        <div class="shelf-arrows">
          <button
            type="button"
            class="shelf-arrow"
            :disabled="ratio <= 0.01"
            aria-label="Previous"
            @click="step(-1)"
          >
            <svg viewBox="0 0 32 20" aria-hidden="true">
              <path d="M13 3 C 8 8, 4 11, 2 11 C 6 11, 14 12, 30 12" />
              <path d="M8 4.5 L2 11 L8 17" />
            </svg>
          </button>
          <button
            type="button"
            class="shelf-arrow"
            :disabled="ratio >= 0.99"
            aria-label="Next"
            @click="step(1)"
          >
            <svg viewBox="0 0 32 20" aria-hidden="true">
              <path d="M2 12 C 18 12, 26 11, 30 11 C 28 11, 24 8, 19 3" />
              <path d="M24 4.5 L30 11 L24 17" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      ref="scroller"
      class="strip"
      :class="{ dragging }"
      tabindex="0"
      aria-label="Selected projects, scroll horizontally"
      @pointerdown="down"
      @pointermove="move"
      @pointerup="up"
      @pointercancel="up"
      @keydown="onKey"
      @click.capture="moved && $event.preventDefault()"
    >
      <article v-for="item in shelf" :key="item.title" class="index-card">
        <div class="index-visual">
          <img
            v-if="item.src"
            :src="item.src"
            :alt="item.alt"
            :style="{ '--pos': item.position }"
          />
          <div v-else class="index-mark" :class="item.tone">{{ item.mark }}</div>
          <span class="index-year">{{ item.year }}</span>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.line }}</p>
      </article>
    </div>
    <div class="meter" aria-hidden="true"><span :style="{ transform: `scaleX(${ratio})` }"></span></div>
    <p class="books-line">
      Author of The GrindSmart Effect, Campus to Career, Mastering AI Prompting, and Dreams to Reality.
    </p>
  </section>
</template>
