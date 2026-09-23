import { createApp } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App.vue'

gsap.registerPlugin(ScrollTrigger)

createApp(App).mount('#app')
