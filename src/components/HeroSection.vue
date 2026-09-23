<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { profile, roles } from '../data.js'
import { finePointer, reduceMotion } from '../motion.js'

const active = ref(0)
const frame = ref(null)
const photo = ref(null)
let clean

onMounted(() => {
  const reduce = reduceMotion()
  if (!reduce) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.where', { y: 14, opacity: 0, duration: 0.7 })
      .fromTo(
        '.line-inner',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.15, stagger: 0.08 },
        '-=0.45',
      )
      .from(
        frame.value,
        { clipPath: 'inset(12% 12% 12% 12%)', duration: 1.35, clearProps: 'clipPath' },
        '-=0.9',
      )
      .from(
        '.hero-fade',
        { y: 18, opacity: 0, duration: 0.9, stagger: 0.07 },
        '-=0.95',
      )
  }

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

onUnmounted(() => clean?.())
</script>

<template>
  <section id="top" class="hero wrap">
    <div class="hero-title">
      <p class="where">Lagos, Nigeria</p>
      <h1 class="display">
        <span class="line"><span class="line-inner">Bayowa</span></span>
        <span class="line"><span class="line-inner">Favour</span></span>
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
            @mouseenter="active = index"
            @focus="active = index"
            @click="active = index"
          >
            {{ role.title }}
          </button>
        </div>
        <p class="role-line" role="tabpanel">{{ roles[active].line }}</p>
      </div>
    </div>
  </section>
</template>
