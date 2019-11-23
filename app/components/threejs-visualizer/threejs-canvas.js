import React from "react"
import { Canvas } from "react-three-fiber"
import styled from "styled-components"
import Scene from "./scene"
import Sphere from "./sphere"
import Plane from "./plane"
import { Provider } from "./useCannon"

const CanvasWrapper = styled.div`
  flex-direction: column;
  grid-area: vis;
  height: 100%;
  position: relative;
`
const ThreeJSCanvas = props => {
  return (
    <CanvasWrapper>
      <Canvas
        camera={{ position: [0, -10, 25] }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.9}
          position={[30, 40, 50]}
          angle={0.2}
          penumbra={1}
          castShadow
        />
        <Provider>
            <Plane position={[0,0,0]}/>
            <Sphere position={[0,0,10]}/>
            {/* <Sphere /> */}
        </Provider>
      </Canvas>
    </CanvasWrapper>
  )
}

export default ThreeJSCanvas
