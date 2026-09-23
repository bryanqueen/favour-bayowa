<script setup>
import { ref } from 'vue'
import { services } from '../data.js'
import { finePointer } from '../motion.js'

const open = ref(0)

function toggle(index, event) {
  if (event.detail !== 0 && finePointer()) return
  open.value = open.value === index ? -1 : index
}
</script>

<template>
  <section class="practice wrap" aria-labelledby="practice-title">
    <div data-reveal>
      <p class="eyebrow">04 — Practice</p>
      <h2 id="practice-title">Where I can come in.</h2>
    </div>
    <ul>
      <li
        v-for="(service, index) in services"
        :key="service.title"
        class="service"
        :class="{ open: open === index }"
      >
        <button
          class="service-hit"
          type="button"
          :aria-expanded="open === index"
          @mouseenter="open = index"
          @focus="finePointer() && (open = index)"
          @click="toggle(index, $event)"
        >
          <span class="service-no">0{{ index + 1 }}</span>
          <h3>{{ service.title }}</h3>
          <span class="service-plus" aria-hidden="true">+</span>
        </button>
        <div class="fold">
          <div class="fold-inner">
            <p>{{ service.body }}</p>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
