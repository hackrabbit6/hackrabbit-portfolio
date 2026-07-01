import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

export function connectGsap(lenis: Lenis | null) {
  gsap.registerPlugin(ScrollTrigger)
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
  }
  return { gsap, ScrollTrigger }
}
