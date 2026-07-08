import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ReadinessSphere3DProps {
  score?: number
  activeNodeId?: string | null
}

function MorphingSphere({ score = 75, activeNodeId = null }: ReadinessSphere3DProps) {
  const pointsRef = useRef<THREE.Points>(null)

  // Determine sphere scale from readiness score
  const baseScale = useMemo(() => {
    // scale ranges from 1.0 to 2.2
    return 1.0 + (score / 100) * 1.2
  }, [score])

  // Determine sphere colors from readiness score and active node focus
  const color = useMemo(() => {
    if (activeNodeId) {
      return '#3b82f6' // Focused blue on node interaction
    }
    if (score >= 80) return '#10b981' // Ready: Green
    if (score >= 50) return '#2f6bf5' // Moderate: SBI Blue
    return '#f59e0b' // Warning: Amber/Gold
  }, [score, activeNodeId])

  // Generate 800 sphere points coordinates
  const positions = useMemo(() => {
    const count = 900
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      
      // Radius of 1.0 before scale
      const r = 1.0 + (Math.random() - 0.5) * 0.1
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Gentle spin
      pointsRef.current.rotation.y = time * 0.15
      pointsRef.current.rotation.x = time * 0.08

      // Apply score-based scale interpolation (lerp)
      pointsRef.current.scale.x = THREE.MathUtils.lerp(pointsRef.current.scale.x, baseScale, 0.08)
      pointsRef.current.scale.y = THREE.MathUtils.lerp(pointsRef.current.scale.y, baseScale, 0.08)
      pointsRef.current.scale.z = THREE.MathUtils.lerp(pointsRef.current.scale.z, baseScale, 0.08)

      // Mouse parallax coordinates displacement
      const targetRotationY = state.pointer.x * 0.4
      const targetRotationX = state.pointer.y * 0.4
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotationY + time * 0.1, 0.05)
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotationX, 0.05)
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export function ReadinessSphere3D({ score = 75, activeNodeId = null }: ReadinessSphere3DProps) {
  return (
    <div className="h-full w-full relative min-h-[300px] md:min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.6} />
        <MorphingSphere score={score} activeNodeId={activeNodeId} />
      </Canvas>
    </div>
  )
}

export default ReadinessSphere3D
