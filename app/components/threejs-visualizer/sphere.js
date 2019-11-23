import React from "react"
import * as THREE from "three"
import * as CANNON from "cannon"
import { useRef } from "react"
import { useFrame } from "react-three-fiber"

const Sphere = props => {
  const ref = useRef()
  // useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01))
  return (
    <mesh ref={ref} castShadow receiveShadow position={[0, 0, 0]}>
      <sphereBufferGeometry attach='geometry' args={[5, 32, 32]} />
      <meshStandardMaterial
        attach='material'
        color={new THREE.Color(0xff00ff)}
        roughness={0.5}
      />
    </mesh>
  )
}

export default Sphere
