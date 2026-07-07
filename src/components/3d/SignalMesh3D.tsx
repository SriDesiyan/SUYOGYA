import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleCloud() {
  const pointsRef = useRef<THREE.Points>(null)

  // Generate random coordinates for 1000 drifting points
  const positions = useMemo(() => {
    const count = 1200
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16 // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16 // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 // Z
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      // Gentle drift rotation
      const time = state.clock.getElapsedTime()
      pointsRef.current.rotation.z = time * 0.005

      // Mouse Parallax physics interpolation (lerp)
      const targetX = state.pointer.x * 0.45
      const targetY = state.pointer.y * 0.45

      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetY, 0.05)
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetX, 0.05)
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#2f6bf5"
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export function SignalMesh3D() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none opacity-50 dark:opacity-30">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <ParticleCloud />
      </Canvas>
    </div>
  )
}

export default SignalMesh3D
