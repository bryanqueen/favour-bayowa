<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { profile, roles } from '../data.js'
import { finePointer, reduceMotion } from '../motion.js'

const headlineWords = ['Bayowa', 'Favour']
const whereChars = 'Lagos, Nigeria'.split('')

const active = ref(0)
const autoplay = ref(false)
const cycleKey = ref(0)
const cycleDuration = 3200
const frame = ref(null)
const photo = ref(null)
let autoplayTimer
let clean

function restartAutoplay() {
  window.clearInterval(autoplayTimer)
  cycleKey.value += 1
  autoplayTimer = window.setInterval(() => {
    active.value = (active.value + 1) % roles.length
    cycleKey.value += 1
  }, cycleDuration)
}

function startAutoplay() {
  autoplay.value = true
  restartAutoplay()
}

function selectRole(index) {
  active.value = index
  if (autoplay.value) restartAutoplay()
  else cycleKey.value += 1
}

onMounted(() => {
  const reduce = reduceMotion()
  if (!reduce) {
    // Set the hidden starting state via GSAP itself (not a permanent CSS rule).
    // GSAP mis-resolves a translate when it has to decompose a pre-existing
    // CSS matrix that already combines rotation + a percentage-based
    // translate, so letting GSAP originate both the "from" and "to" state
    // keeps its internal transform cache unambiguous.
    gsap.set('.char', { yPercent: 130, rotate: 6, filter: 'blur(10px)' })
    gsap.set('.ink-char', { opacity: 0, scaleX: 0.4, skewX: -10, filter: 'blur(1px)' })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.to('.char', {
      yPercent: 0,
      rotate: 0,
      filter: 'blur(0px)',
      duration: 1,
      stagger: 0.025,
      ease: 'power4.out',
    })
      .from(
        frame.value,
        { clipPath: 'inset(12% 12% 12% 12%)', duration: 1.35, clearProps: 'clipPath' },
        '-=0.85',
      )
      .to(
        '.ink-char',
        {
          opacity: 1,
          scaleX: 1,
          skewX: 0,
          filter: 'blur(0px)',
          duration: 0.45,
          stagger: 0.045,
          ease: 'power2.out',
        },
        '-=0.5',
      )
      .from('.hero-fade', { y: 18, opacity: 0, duration: 0.9, stagger: 0.07 }, '-=0.2')
  }

  if (!finePointer()) startAutoplay()

  if (!finePointer() || reduce || !frame.value) return

  const xTo = gsap.quickTo(photo.value, 'x', { duration: 0.7, ease: 'power3.out' })
  const yTo = gsap.quickTo(photo.value, 'y', { duration: 0.7, ease: 'power3.out' })
  const rx = gsap.quickTo(frame.value, 'rotateX', { duration: 0.7, ease: 'power3.out' })
  const ry = gsap.quickTo(frame.value, 'rotateY', { duration: 0.7, ease: 'power3.out' })

  const move = (event) => {
    const rect = frame.value.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    xTo(px * -14)
    yTo(py * -12)
    rx(py * -7)
    ry(px * 8)
  }
  const leave = () => {
    xTo(0)
    yTo(0)
    rx(0)
    ry(0)
  }

  frame.value.addEventListener('pointermove', move)
  frame.value.addEventListener('pointerleave', leave)
  clean = () => {
    frame.value?.removeEventListener('pointermove', move)
    frame.value?.removeEventListener('pointerleave', leave)
  }
})

onUnmounted(() => {
  clean?.()
  window.clearInterval(autoplayTimer)
})
</script>

<template>
  <section id="top" class="hero wrap">
    <div class="hero-title">
      <p class="where">
        <span v-for="(char, index) in whereChars" :key="'where-' + index" class="ink-char">{{
          char === ' ' ? '\u00A0' : char
        }}</span>
      </p>
      <h1 class="display">
        <span v-for="word in headlineWords" :key="word" class="line">
          <span class="line-inner">
            <span v-for="(char, index) in word.split('')" :key="word + index" class="char">{{
              char
            }}</span>
          </span>
        </span>
      </h1>
    </div>

    <div class="portrait-wrap">
      <figure ref="frame" class="portrait-frame">
        <img
          ref="photo"
          src="/images/portrait.jpg"
          alt="Bayowa Favour, arms crossed, against a terracotta backdrop"
        />
        <figcaption class="portrait-note">that’s me</figcaption>
      </figure>
    </div>

    <div class="hero-rest">
      <p class="lede hero-fade">{{ profile.lede }}</p>
      <div class="role-block">
        <div class="roles" role="tablist" aria-label="What I do">
          <button
            v-for="(role, index) in roles"
            :key="role.title"
            class="role hero-fade"
            type="button"
            role="tab"
            :aria-selected="active === index"
            @mouseenter="selectRole(index)"
            @focus="selectRole(index)"
            @click="selectRole(index)"
          >
            <span class="role-label">{{ role.title }}</span>
            <span class="role-progress" aria-hidden="true">
              <span
                v-if="autoplay && active === index"
                :key="cycleKey"
                class="role-progress-fill"
                :style="{ animationDuration: cycleDuration + 'ms' }"
              ></span>
            </span>
          </button>
        </div>
        <Transition name="role-fade" mode="out-in">
          <p class="role-line" role="tabpanel" :key="active">{{ roles[active].line }}</p>
        </Transition>
      </div>
    </div>
  </section>
</template>
