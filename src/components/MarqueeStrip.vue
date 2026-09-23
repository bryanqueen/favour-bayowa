<script setup>
import { marquee } from '../data.js'
</script>

<template>
  <section class="marquee-section" aria-label="Practices and projects">
    <p class="sr-only">{{ marquee.join(', ') }}</p>
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <div v-for="copy in 2" :key="copy" class="marquee-group" :aria-hidden="copy === 2">
          <template v-for="item in marquee" :key="`${copy}-${item}`">
            <span class="dot">·</span>
            <span>{{ item }}</span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
