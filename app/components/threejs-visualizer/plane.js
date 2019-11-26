import React from 'react'
import * as CANNON from 'cannon'
import { useCannon } from './useCannon'

const Plane = ({ position, mass = 0 }) => {
    const ref = useCannon({mass: mass}, body => {
        body.addShape(new CANNON.Plane())
        body.position.set(...position)
    })
    return (
        <mesh ref={ref} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshPhongMaterial attach="material" color="#272727" />
        </mesh>
    )
}

export default Plane