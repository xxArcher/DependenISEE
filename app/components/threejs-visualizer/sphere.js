import React from "react"
import * as THREE from "three"
import * as CANNON from 'cannon'
import { useCannon } from './useCannon'

const Sphere = ({ position, radius = 1, mass = 5, ...props }) => {
  const ref = useCannon({ mass: mass }, body => {
    body.addShape(new CANNON.Sphere(radius))
    body.position.set(...position)
    body.linearDamping = 0.5
  })
  return (
    <mesh ref={ref} castShadow receiveShadow position={[0, 0, 0]}>
      <sphereBufferGeometry attach='geometry' args={[radius, 32, 32]} />
      <meshStandardMaterial
        attach='material'
        color={new THREE.Color(0xff00ff)}
        roughness={0.5}
      />
    </mesh>
  )
}

export default Sphere
