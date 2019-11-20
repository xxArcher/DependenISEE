import React, { Component } from 'react'
import { Canvas } from 'react-three-fiber'
import styled from 'styled-components'
import Scene from './scene'

const CanvasWrapper = styled.div`
    flex-direction: column;
    grid-area: vis;
    height: 100%;
    position: relative;
`
const ThreeJSCanvas = props => {
    return <CanvasWrapper>
        <Canvas >
            {/* // style={{ background: '#324444' }}
            // camera={{ position: [0, 50, 10], fov: 75 }}> */}
            <Scene />
        </Canvas>
    </CanvasWrapper>
}

export default ThreeJSCanvas