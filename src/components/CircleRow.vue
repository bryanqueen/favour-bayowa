<script setup>
import { circles } from '../data.js'
</script>

<template>
  <section class="moments wrap" aria-label="Moments">
    <p class="moments-line" data-reveal>Eight months. A brand, a room, and a shelf of books.</p>
    <div class="circles">
      <figure v-for="item in circles" :key="item.label" class="circle" tabindex="0">
        <div class="circle-frame">
          <img :src="item.src" :alt="item.alt" :style="{ '--pos': item.position }" />
        </div>
        <figcaption>{{ item.label }}</figcaption>
      </figure>
    </div>
  </section>
</template>
