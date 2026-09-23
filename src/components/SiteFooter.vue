<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { profile } from '../data.js'
import { finePointer } from '../motion.js'

const copied = ref(false)
const email = ref(null)
const creditOpen = ref(false)
const creditWrap = ref(null)
let timer
let clean

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
  } catch {
    const field = document.createElement('textarea')
    field.value = profile.email
    document.body.appendChild(field)
    field.select()
    document.execCommand('copy')
    field.remove()
  }
  copied.value = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    copied.value = false
  }, 1600)
}

function openCredit(event) {
  event.stopPropagation()
  creditOpen.value = true
}

function onWrapPointerEnter(event) {
  if (event.pointerType === 'mouse') creditOpen.value = true
}

function closeCredit() {
  creditOpen.value = false
}

function onDocPointer(event) {
  if (creditWrap.value && !creditWrap.value.contains(event.target)) {
    creditOpen.value = false
  }
}

function onDocKey(event) {
  if (event.key === 'Escape') creditOpen.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
  document.addEventListener('keydown', onDocKey)

  if (!finePointer() || !email.value) return
  const xTo = gsap.quickTo(email.value, 'x', { duration: 0.4, ease: 'power3.out' })
  const yTo = gsap.quickTo(email.value, 'y', { duration: 0.4, ease: 'power3.out' })
  const move = (event) => {
    const rect = email.value.getBoundingClientRect()
    xTo((event.clientX - (rect.left + rect.width / 2)) * 0.12)
    yTo((event.clientY - (rect.top + rect.height / 2)) * 0.28)
  }
  const leave = () => {
    xTo(0)
    yTo(0)
  }
  email.value.addEventListener('pointermove', move)
  email.value.addEventListener('pointerleave', leave)
  clean = () => {
    email.value?.removeEventListener('pointermove', move)
    email.value?.removeEventListener('pointerleave', leave)
  }
})

onUnmounted(() => {
  clean?.()
  document.removeEventListener('pointerdown', onDocPointer)
  document.removeEventListener('keydown', onDocKey)
  window.clearTimeout(timer)
})
</script>

<template>
  <footer id="contact" class="footer wrap">
    <div data-reveal>
      <p class="eyebrow">06 — Contact</p>
      <p class="footer-lede">{{ profile.close }}</p>
      <p class="copy-label">{{ copied ? 'Copied' : 'Click to copy' }}</p>
      <button ref="email" class="email" type="button" @click="copyEmail">
        {{ copied ? 'Copied.' : profile.email }}
      </button>
      <p class="sr-only" aria-live="polite">{{ copied ? 'Email copied to clipboard' : '' }}</p>
      <div class="footer-links">
        <a :href="profile.linkedin" target="_blank" rel="noreferrer">LinkedIn</a>
        <a :href="`tel:${profile.phone}`">{{ profile.phoneDisplay }}</a>
        <a :href="profile.gse" target="_blank" rel="noreferrer">GSE Academy</a>
        <span>Lagos, Nigeria</span>
      </div>
    </div>
    <div class="legal">
      <span>Bayowa Favour · Content strategist</span>
      <p class="credit">
        Designed &amp; built by
        <span ref="creditWrap" class="credit-wrap" @pointerenter="onWrapPointerEnter">
          <button
            type="button"
            class="credit-trigger"
            aria-haspopup="dialog"
            :aria-expanded="creditOpen"
            @click="openCredit"
          >
            Somtochukwu
          </button>
          <div class="credit-card" :class="{ open: creditOpen }" role="dialog" aria-label="About the site designer">
            <img src="/images/credit-somtochukwu.png" alt="Portrait of Somtochukwu" />
            <div class="credit-card-body">
              <p class="credit-card-name">Somtochukwu</p>
              <p class="credit-card-role">Design Engineer</p>
              <div class="credit-card-links">
                <a href="https://linkedin.com/in/somto-daniel" target="_blank" rel="noreferrer" @click="closeCredit">LinkedIn</a>
                <a href="https://wa.me/2348090219575" target="_blank" rel="noreferrer" @click="closeCredit">WhatsApp</a>
                <a href="mailto:somtochukwu@mathlon.app" @click="closeCredit">Email</a>
              </div>
            </div>
          </div>
        </span>
      </p>
      <span>© {{ new Date().getFullYear() }}</span>
    </div>
  </footer>
</template>
