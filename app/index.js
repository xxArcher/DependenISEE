import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

import Canvas from './components/visualizer/canvas';
import { SidePanel } from './components/visualizer/sidePanel';

const GlobalStyle = createGlobalStyle`
    html, body, #content {
        height: 100%;
        margin: 0;
    }
`;
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
`;

const IndexPage = () => {
    const [url, setUrl] = useState(null);

    return <StyledContent>
        <GlobalStyle />
        <SidePanel setUrl={setUrl}/>
        <Canvas id="dependencyVisualizer" url={url} />
    </StyledContent>;
};

let contentDiv = document.getElementById('content');
ReactDOM.render(<IndexPage />, contentDiv);