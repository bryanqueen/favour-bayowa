<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import HeroSection from './components/HeroSection.vue'
import MarqueeStrip from './components/MarqueeStrip.vue'
import WorkSection from './components/WorkSection.vue'
import ResultsSection from './components/ResultsSection.vue'
import FrameworkSection from './components/FrameworkSection.vue'
import PracticeSection from './components/PracticeSection.vue'
import IndexStrip from './components/IndexStrip.vue'
import SiteFooter from './components/SiteFooter.vue'
import { finePointer, reduceMotion } from './motion.js'

const hidden = ref(false)
const scrolled = ref(false)
const cursorOn = ref(false)
const cursorHot = ref(false)
const progress = ref(null)
const cursor = ref(null)

let lenis
let ctx
const cleanups = []

onMounted(() => {
  const reduce = reduceMotion()
  const fine = finePointer()

  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    anchors: true,
    allowNestedScroll: true,
  })

  lenis.on('scroll', (instance) => {
    ScrollTrigger.update()
    if (progress.value) {
      progress.value.style.transform = `scaleX(${instance.progress})`
    }
    scrolled.value = instance.scroll > 8
    hidden.value = instance.direction === 1 && instance.scroll > 140
  })

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  if (!reduce) {
    ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
    })
  }

  if (fine && !reduce && cursor.value) {
    document.body.classList.add('has-cursor')
    const xTo = gsap.quickTo(cursor.value, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor.value, 'y', { duration: 0.45, ease: 'power3.out' })
    const move = (event) => {
      xTo(event.clientX)
      yTo(event.clientY)
      cursorOn.value = true
      cursorHot.value = Boolean(
        event.target.closest('a, button, .index-card') &&
          !event.target.closest('.credit-wrap'),
      )
    }
    const leave = () => {
      cursorOn.value = false
    }
    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    cleanups.push(() => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    })
  }

  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh)
  requestAnimationFrame(refresh)
  cleanups.push(() => window.removeEventListener('load', refresh))
})

onUnmounted(() => {
  ctx?.revert()
  lenis?.destroy()
  cleanups.forEach((fn) => fn())
  document.body.classList.remove('has-cursor')
})
</script>

<template>
  <div class="progress" ref="progress" aria-hidden="true"></div>
  <div
    ref="cursor"
    class="cursor"
    :class="{ on: cursorOn, hot: cursorHot }"
    aria-hidden="true"
  >
    <i></i>
  </div>

  <a class="sr-only" href="#work">Skip to work</a>

  <header class="nav" :class="{ hide: hidden, scrolled }">
    <a class="wordmark" href="#top">
      <span class="full">Bayowa Favour</span>
      <span class="short">Bayowa</span>
    </a>
    <nav class="nav-links" aria-label="Page">
      <a href="#work">Work</a>
      <a href="#proof">Proof</a>
      <a href="#approach">Method</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <HeroSection />
    <MarqueeStrip />
    <WorkSection />
    <ResultsSection />
    <FrameworkSection />
    <PracticeSection />
    <IndexStrip />
    <SiteFooter />
  </main>
</template>
