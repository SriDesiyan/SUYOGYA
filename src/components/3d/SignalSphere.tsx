import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PointMaterial, Points } from '@react-three/drei'
import * as THREE from 'three'

function PointsSphere() {
  const pointsRef = useRef<THREE.Points>(null)
  const [hovered, setHovered] = useState(false)

  // Memoize positions to avoid rebuilding array on every render
  const positions = useMemo(() => {
    const count = 400
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 2.1 + Math.random() * 0.25 // sphere shell radius

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotation logic
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.04
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.015

      // Hover scale animation
      const targetScale = hovered ? 1.15 : 1.0
      pointsRef.current.scale.x = THREE.MathUtils.lerp(pointsRef.current.scale.x, targetScale, 0.1)
      pointsRef.current.scale.y = THREE.MathUtils.lerp(pointsRef.current.scale.y, targetScale, 0.1)
      pointsRef.current.scale.z = THREE.MathUtils.lerp(pointsRef.current.scale.z, targetScale, 0.1)
    }
  })

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={hovered ? '#1a4fd6' : '#2f6bf5'}
          size={0.09}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Outer subtle wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2.0, 16, 16]} />
        <meshBasicMaterial
          color={hovered ? '#bcd3ff' : '#8db6ff'}
          wireframe
          transparent
          opacity={hovered ? 0.22 : 0.08}
        />
      </mesh>
    </group>
  )
}

export function SignalSphere() {
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-line bg-surface/20 backdrop-blur-md">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <PointsSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-line bg-surface/85 px-3 py-1.5 text-[10px] font-bold tracking-widest text-content-muted shadow-elev-1">
        LIVE ENGAGEMENT FIELD
      </div>
    </div>
  )
}
export default SignalSphere
