import { lazy, Suspense, useEffect, useState } from 'react'

const HeroCanvas = lazy(() => import('./HeroCanvas').then((module) => ({ default: module.HeroCanvas })))

export function HeroCanvasMount() {
  const [showCanvas, setShowCanvas] = useState(false)

  useEffect(() => {
    setShowCanvas(
      window.innerWidth >= 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [])

  if (!showCanvas) return null

  return (
    <Suspense fallback={null}>
      <HeroCanvas />
    </Suspense>
  )
}
