import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
  return lenis
}
