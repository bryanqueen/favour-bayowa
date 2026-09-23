<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { results } from '../data.js'
import { reduceMotion } from '../motion.js'
import StatIcon from './StatIcon.vue'

function format(value) {
  return Math.round(value).toLocaleString('en-US')
}

onMounted(() => {
  if (reduceMotion()) return

  gsap.utils.toArray('.result-icon').forEach((el, index) => {
    gsap.from(el, {
      opacity: 0,
      scale: 0.5,
      rotate: index % 2 ? 10 : -10,
      duration: 0.6,
      ease: 'back.out(2.4)',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    })
  })

  document.querySelectorAll('article.result').forEach((article) => {
    const countEl = article.querySelector('.count')
    if (!countEl) return
    const end = Number(countEl.dataset.end)
    const arrow = article.querySelector('.stat-arrow')
    const circle = article.querySelector('.scribble-circle path')
    const note = article.querySelector('.scribble-note')
    const state = { val: 0 }

    gsap.to(state, {
      val: end,
      duration: 1.45,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: article,
        start: 'top 96%',
        once: true,
        onEnter: () => {
          if (arrow) {
            gsap.to(arrow, { opacity: 1, scaleX: 1, duration: 0.55, ease: 'back.out(2)' })
          }
          if (circle) {
            gsap.to(circle, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', delay: 0.3 })
          }
          if (note) {
            gsap.to(note, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.9 })
          }
        },
      },
      onUpdate: () => {
        countEl.textContent = format(state.val)
      },
    })
  })
})
</script>

<template>
  <section id="proof" class="proof">
    <div class="wrap">
      <div data-reveal>
        <p class="eyebrow">02 — Proof</p>
        <h2 class="proof-title">Attention that became a list, a room, and a sale.</h2>
      </div>
      <div class="results">
        <article
          v-for="item in results"
          :key="item.label"
          class="result"
          :class="[`align-${item.align}`, `size-${item.size}`, { flagship: item.flagship }]"
          :style="{ '--tilt': `${item.tilt}deg`, '--shift': item.shift || '0' }"
        >
          <StatIcon :name="item.icon" class="result-icon" />
          <p
            class="result-num"
            :aria-label="`${item.start != null ? item.start + ' to ' : ''}${format(item.end)}${item.suffix} ${item.label}`"
          >
            <template v-if="item.start != null">{{ format(item.start) }}
              <svg class="stat-arrow" viewBox="0 0 60 20" aria-hidden="true">
                <path d="M2 14 Q20 4 38 10 T56 8" />
                <path d="M48 3.5 L56 8 L48.5 13.5" />
              </svg>
            </template>
            <span class="stat-value">
              <span class="count" :data-end="item.end">{{ format(item.end) }}</span
              >{{ item.suffix }}
              <svg
                v-if="item.flagship"
                class="scribble-circle"
                viewBox="0 0 340 110"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M35 88 C 18 55, 55 15, 150 12 C 245 9, 320 30, 322 62 C 324 92, 250 108, 160 106 C 80 104, 25 90, 48 68"
                />
              </svg>
              <span v-if="item.note" class="scribble-note" aria-hidden="true">{{ item.note }}</span>
            </span>
          </p>
          <p class="result-label">{{ item.label }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
