import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import './HeroCanvas.css'

function Field() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#39FF8B') },
    }),
    [],
  )

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta
  })

  return (
    <mesh>
      <planeGeometry args={[6, 4, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={`
          precision mediump float;
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          void main() {
            vec2 uv = vUv;
            vec2 p = (uv - 0.5) * vec2(1.8, 1.0);
            float n = noise(p * 8.0 + uTime * 0.16);
            float beam = smoothstep(0.58, 0.92, n) * 0.32;
            float vignette = smoothstep(0.95, 0.22, length(p));
            vec3 base = vec3(0.043, 0.043, 0.055);
            vec3 color = base + uColor * beam * vignette;
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  )
}

export function HeroCanvas() {
  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <Field />
      </Canvas>
    </div>
  )
}
