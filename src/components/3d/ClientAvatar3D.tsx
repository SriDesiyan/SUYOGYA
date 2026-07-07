import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ClientAvatar3DProps {
  segment?: 'HNI' | 'Affluent' | 'Emerging'
}

function VectorSphere({ segment = 'Affluent' }: ClientAvatar3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.LineSegments>(null)

  // Map segment to high-fidelity colors
  const color = useMemo(() => {
    if (segment === 'HNI') return '#eab308' // Gold
    if (segment === 'Affluent') return '#2f6bf5' // SBI Blue / Cyan
    return '#64748b' // Slate / Emerging
  }, [segment])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      // Rotate gently
      meshRef.current.rotation.y = time * 0.15
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.12

      // Apply subtle pointer parallax displacement
      const targetX = state.pointer.x * 0.35
      const targetY = state.pointer.y * 0.35

      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.05)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetY, 0.05)
    }

    if (lineRef.current) {
      lineRef.current.rotation.y = -time * 0.08
      lineRef.current.rotation.z = Math.cos(time * 0.05) * 0.1
    }
  })

  // Pre-generate geometry parameters to prevent rebuilds
  const innerGeo = useMemo(() => new THREE.IcosahedronGeometry(1.4, 1), [])
  const outerGeo = useMemo(() => new THREE.IcosahedronGeometry(1.45, 2), [])

  return (
    <group>
      {/* Central Solid transparent sphere */}
      <mesh ref={meshRef} geometry={innerGeo}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
      </mesh>

      {/* Outer Wireframe structure */}
      <lineSegments ref={lineRef}>
        <wireframeGeometry args={[outerGeo]} />
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </lineSegments>

      {/* Core Glowing Node */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

export function ClientAvatar3D({ segment = 'Affluent' }: ClientAvatar3DProps) {
  return (
    <div className="h-full w-full relative min-h-[220px]">
      <Canvas camera={{ position: [0, 0, 3.8], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.7} />
        <VectorSphere segment={segment} />
      </Canvas>
    </div>
  )
}

export default ClientAvatar3D
