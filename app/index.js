import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

import Canvas from './components/visualizer/canvas';
import SidePanel from './components/visualizer/sidePanel';

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

class IndexPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            url: null
        }

        this.getRepoSubmit = this.getRepoSubmit.bind(this);
    }

    getRepoSubmit(ev) {
        ev.preventDefault();
        const formElements = ev.target.elements;
        const url = formElements.namedItem("repoUrl").value;
        this.setState({ url });
    }
    
    render() {
        const { url } = this.state;

        return <StyledContent>
            <GlobalStyle />
            <SidePanel getRepoSubmit={this.getRepoSubmit}/>
            <Canvas id="dependencyVisualizer" url={url} />
        </StyledContent>;
    }
}

let contentDiv = document.getElementById('content');
ReactDOM.render(<IndexPage />, contentDiv);