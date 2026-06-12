import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createPointField(count: number) {
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const radius = 3.8 + Math.random() * 3.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)

    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[index * 3 + 2] = radius * Math.cos(phi)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  return geometry
}

function ThreeBackdrop() {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    })
    renderer.setClearAlpha(0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    host.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const coreGeometry = new THREE.IcosahedronGeometry(1.7, 1)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x13795b,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.position.set(2.3, 0.2, 0)
    group.add(core)

    const ringGeometry = new THREE.TorusKnotGeometry(1.15, 0.08, 120, 10)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x253241,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.set(-2.5, -0.8, -1.2)
    group.add(ring)

    const pointGeometry = createPointField(160)
    const pointMaterial = new THREE.PointsMaterial({
      color: 0x13795b,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
    })
    const points = new THREE.Points(pointGeometry, pointMaterial)
    group.add(points)

    const mouse = new THREE.Vector2(0, 0)
    const startedAt = performance.now()

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    const onPointerMove = (event: PointerEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)

    let animationFrame = 0
    const animate = () => {
      const elapsed = (performance.now() - startedAt) / 1000
      group.rotation.y = elapsed * 0.08 + mouse.x * 0.08
      group.rotation.x = -0.15 + mouse.y * 0.05
      core.rotation.x = elapsed * 0.16
      core.rotation.z = elapsed * 0.1
      ring.rotation.x = elapsed * 0.12
      ring.rotation.y = elapsed * 0.18
      points.rotation.y = -elapsed * 0.025

      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      host.removeChild(renderer.domElement)
      coreGeometry.dispose()
      coreMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      pointGeometry.dispose()
      pointMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div className="three-backdrop" ref={hostRef} aria-hidden="true" />
}

export default ThreeBackdrop
