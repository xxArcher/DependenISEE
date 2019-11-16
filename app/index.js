import React from 'react';
import ReactDOM from 'react-dom';

import { Box } from './components/form/box';
import { Button } from './components/form/button';
import Canvas from './components/visualizer/canvas';

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

        return <React.Fragment>
            <form id="getGitRepo" onSubmit={this.getRepoSubmit}>
                <Box id="repoUrl"/>
                <Button label="test" form="getGitRepo"/>
            </form>
            <Canvas id="dependencyVisualizer" url={url} />
        </React.Fragment>;
    }
}

let contentDiv = document.getElementById('content');
ReactDOM.render(<IndexPage />, contentDiv);