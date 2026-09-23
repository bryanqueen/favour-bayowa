<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { prints, profile } from '../data.js'
import { finePointer, reduceMotion } from '../motion.js'

const active = ref(prints.find((item) => item.id === 'summit'))
const stage = ref(null)
let ctx
let observer

function tilt(event) {
  if (!finePointer()) return
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - 0.5
  const py = (event.clientY - rect.top) / rect.height - 0.5
  const base = Number(el.dataset.rotate)
  gsap.to(el, {
    rotateX: py * -9,
    rotateY: px * 11,
    rotate: base * 0.25,
    scale: 1.045,
    duration: 0.45,
    ease: 'power3.out',
    transformPerspective: 800,
  })
}

function untilt(event) {
  if (!finePointer()) return
  const el = event.currentTarget
  gsap.to(el, {
    rotateX: 0,
    rotateY: 0,
    rotate: Number(el.dataset.rotate),
    scale: 1,
    duration: 0.7,
    ease: 'power3.out',
  })
}

onMounted(() => {
  const reduce = reduceMotion()
  ctx = gsap.context(() => {
    if (!reduce) {
      gsap.to('.squiggle path', {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.squiggle', start: 'top 85%' },
      })
    }

    if (!reduce && window.matchMedia('(min-width: 981px)').matches) {
      gsap.utils.toArray('.float').forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 28 + index * 8 },
          {
            y: index % 2 === 0 ? -24 : 18,
            ease: 'none',
            scrollTrigger: {
              trigger: stage.value,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }
  }, stage.value?.parentElement)

  if (window.matchMedia('(max-width: 980px)').matches && stage.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const found = prints.find((item) => item.id === entry.target.dataset.id)
          if (found) active.value = found
        })
      },
      { root: stage.value, threshold: 0.62 },
    )
    stage.value.querySelectorAll('.float').forEach((el) => observer.observe(el))
  }
})

onUnmounted(() => {
  ctx?.revert()
  observer?.disconnect()
})
</script>

<template>
  <section id="work" class="work wrap">
    <div data-reveal>
      <p class="eyebrow">01 — Selected</p>
      <h2 class="project-title">
        GSE Academy
        <svg class="squiggle" viewBox="0 0 200 20" aria-hidden="true">
          <path d="M4 12 C 24 4, 40 18, 70 10 S 120 2, 150 12 S 180 18, 196 8" />
        </svg>
      </h2>
      <p class="kicker">Founder and content strategist · 2025—present</p>
      <p class="work-body">
        University students were leaving with the degree and without a way into work.
        GSE Academy started as the answer: a position, a community, webinars, a summit,
        and books people paid for.
      </p>
      <p class="work-body">
        The work was never “what should we post.” It was who this is for, what they
        already worry about, and the next step that should follow.
      </p>
      <blockquote>Universities teach academics. GSE teaches employability.</blockquote>
      <Transition name="fade" mode="out-in">
        <p class="live-note" :key="active.id">{{ active.note }}</p>
      </Transition>
      <p class="hint hint-fine">Hover a piece</p>
      <p class="hint hint-coarse">Swipe the pieces</p>
      <a class="arrow-link" :href="profile.gse" target="_blank" rel="noreferrer">
        Visit the academy <span aria-hidden="true">→</span>
      </a>
    </div>

    <div ref="stage" class="stage" aria-label="GSE work">
      <div
        v-for="item in prints"
        :key="item.id"
        class="float"
        :data-id="item.id"
        :style="{
          '--x': item.x,
          '--y': item.y,
          '--w': item.w,
          '--z': item.z,
        }"
      >
        <button
          class="print"
          type="button"
          :data-rotate="item.r"
          :style="{ '--r': item.r + 'deg', '--ratio': item.ratio, '--pos': item.position }"
          :aria-pressed="active.id === item.id"
          @mouseenter="active = item"
          @focus="active = item"
          @pointermove="tilt"
          @pointerleave="untilt"
        >
          <img :src="item.src" :alt="item.alt" />
          <span class="cap">{{ item.caption }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
