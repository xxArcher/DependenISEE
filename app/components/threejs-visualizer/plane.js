import React, { useRef } from 'react'

const Plane = (props) => {
    const ref = useRef()
    return (
        <mesh ref={ref} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshPhongMaterial attach="material" color="#272727" />
        </mesh>
    )
}

export default Plane