<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { steps } from '../data.js'

const root = ref(null)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => document.body.classList.toggle('method-open', entry.isIntersecting),
    { rootMargin: '-8% 0px -50% 0px', threshold: 0 },
  )
  observer.observe(root.value)
})

onUnmounted(() => {
  observer?.disconnect()
  document.body.classList.remove('method-open')
})
</script>

<template>
  <section id="approach" ref="root" class="method">
    <div class="method-grain" aria-hidden="true"></div>
    <div class="wrap">
      <header class="method-intro">
        <p class="eyebrow">03 — Method</p>
        <h2>Every piece of content<br />has a job.</h2>
      </header>
      <ol class="method-frames">
        <li v-for="(step, index) in steps" :key="step.word">
          <div class="method-step">
            <span>0{{ index + 1 }}</span>
            <h3>{{ step.word }}</h3>
          </div>
          <p>{{ step.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
