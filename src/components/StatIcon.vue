<script setup>
defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <svg class="stat-icon" viewBox="0 0 32 32" aria-hidden="true">
    <g v-if="name === 'linkedin'">
      <path
        d="M5 6 Q4 4 6 4 H26 Q28 4 27 6 Q28 8 27 10 V25 Q28 27 26 28 H6 Q4 27 5 25 V10 Q4 8 5 6 Z"
      />
      <circle cx="10.5" cy="11" r="1.3" fill="currentColor" />
      <path d="M10.5 14.5 V23" />
      <path d="M16 23 V15 Q16 13 18.5 14.5 Q21 16 21 18 V23" />
    </g>

    <g v-else-if="name === 'instagram'">
      <path
        d="M5 6 Q4 4 6 4 H26 Q28 4 27 6 Q28 8 27 10 V25 Q28 27 26 28 H6 Q4 27 5 25 V10 Q4 8 5 6 Z"
      />
      <circle cx="16" cy="16.5" r="6" />
      <circle cx="22.5" cy="9.5" r="1.3" fill="currentColor" />
    </g>

    <g v-else-if="name === 'youtube'">
      <path
        d="M4 10 Q4 7.5 6.5 7.5 H25.5 Q28 7.5 28 10 V22 Q28 24.5 25.5 24.5 H6.5 Q4 24.5 4 22 Z"
      />
      <path d="M13.5 12.5 L21.5 16.2 L13.5 20 Z" fill="currentColor" />
    </g>

    <g v-else-if="name === 'spotify'">
      <circle cx="16" cy="16" r="12.5" />
      <path d="M9 13.5 Q16 10.5 23 13.5" />
      <path d="M9.5 17.5 Q16 15 22.5 17.5" />
      <path d="M10.5 21.5 Q16 19.5 21.5 21.5" />
    </g>

    <g v-else-if="name === 'pencil'">
      <path d="M6.5 25.5 L9.5 24.5 L23 11 Q25 9 23 7 Q21 5 19 7 L5.5 20.5 Z" />
      <path d="M5.5 20.5 L4 27 L9.5 24.5" />
      <path d="M18 8 L22 12" />
    </g>

    <g v-else-if="name === 'people'">
      <circle cx="12" cy="11.5" r="4" />
      <path d="M5 27 Q5 18.5 12 18.5 Q19 18.5 19 27" />
      <circle cx="22" cy="13.5" r="3.2" />
      <path d="M17.5 27 Q17.5 20.5 22 20.5 Q26.5 20.5 26.5 27" />
    </g>

    <g v-else-if="name === 'mic'">
      <path d="M13 5 Q13 2.5 16 2.5 Q19 2.5 19 5 V15 Q19 18 16 18 Q13 18 13 15 Z" />
      <path d="M9 14 Q9 21.5 16 21.5 Q23 21.5 23 14" />
      <path d="M16 21.5 V27" />
      <path d="M11 27 H21" />
    </g>

    <g v-else-if="name === 'book'">
      <path d="M16 9 Q9 5.5 4.5 8 V24.5 Q10 21.5 16 24.5 Z" />
      <path d="M16 9 Q23 5.5 27.5 8 V24.5 Q22 21.5 16 24.5 Z" />
      <path d="M16 9 V24.5" />
    </g>
  </svg>
</template>
