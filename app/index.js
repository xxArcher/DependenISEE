import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import { map } from 'ramda'
import styled, { createGlobalStyle } from "styled-components"

import Canvas from "./components/visualizer/canvas"
import ThreeJSCanvas from "./components/threejs-visualizer/threejs-canvas"
import { SidePanel } from "./components/visualizer/sidePanel"
import {
  readrepo,
  readPackageJson,
  readYarnLock,
  getUpgradeInfo,
  getSizeOfPackages
} from "./utils/get-data"
import { dependency, devDependency } from "./utils/format-results"

const GlobalStyle = createGlobalStyle`
    html, body, #content {
        height: 100%;
        margin: 0;
    }
`
const StyledContent = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 30% 1fr 1fr;
  grid-template-rows: 35% 1fr 1fr;
  grid-template-areas:
    "upper vis vis"
    "lower vis vis"
    "lower vis vis";
  height: 100%;
  text-align: center;
`

const IndexPage = () => {
  const [url, setUrl] = useState(null)
  const [show3D, setShow3D] = useState(false)
  const [ repoInfo, setRepoInfo] = useState(null)
  const [ packageInfo, setPackageInfo] = useState(null)
  const [ yarnlockInfo, setYarnlockInfo] = useState(null)
  const [ upgradeInfo, setUpgradeInfo] = useState(null)
  const [ sizeInfo, setSizeInfo] = useState(null)
  
    let repo
    let pack
    let yarnlock
    let upgrade
    let packages = []
    let size

  const getData = async url => {
    repo = await readrepo(url)

    if (repo) {
      pack = await readPackageJson(url)
      yarnlock = await readYarnLock(url)
      upgrade = await getUpgradeInfo(url)
      if (yarnlock) {
          map(x => packages.push("\"" + x.name +"\""), yarnlock.dependency)
          map(x => packages.push("\"" + x.name +"\""), yarnlock.devDependency)
      }
      size = await getSizeOfPackages(packages)
      setSizeInfo(size)
      setRepoInfo(repo)
      setPackageInfo(pack)
      setYarnlockInfo(yarnlock)
      setUpgradeInfo(upgrade)

      console.log(sizeInfo)

    }
  }
  useEffect(() => {
    async function getDataAsync() {
      await getData(url)
    }
    if (url) getDataAsync()
  }, [url])

  return (
    <StyledContent>
      <GlobalStyle />
      <SidePanel setUrl={setUrl} />
      {show3D ? (
        <ThreeJSCanvas
          yarnlockInfo={yarnlockInfo}
          repoInfo={repoInfo}
          upgradeInfo={upgradeInfo}
        />
      ) : (
        repoInfo && yarnlockInfo && <Canvas id='dependencyVisualizer' url={url} repoInfo={repoInfo} dependencyInfo={yarnlockInfo}/>
      )}
    </StyledContent>
  )
}

let contentDiv = document.getElementById("content")
ReactDOM.render(<IndexPage />, contentDiv)
