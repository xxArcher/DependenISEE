import React from 'react';
import ReactDOM from 'react-dom';

import { Box } from './components/form/box';
import { Button } from './components/form/button';
import Canvas from './components/visualizer/canvas';

import styles from './index.css';

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
            <div className={styles.upperContent}>
                <p className={styles.title}>Visualize a Repository's Dependencies</p>
                <form id="getGitRepo" onSubmit={this.getRepoSubmit} className={styles.getRepoForm}>
                    <Box id="repoUrl"/>
                    <Button label="Visualize" form="getGitRepo"/>
                </form>
            </div>
            <div className={styles.description}>
                <p>Enter a Github repository URL and click submit. You will be greeted with a visualization of your repository's dependencies. Clicking on an individual node will allow you to visualize the following:</p>
                <ul>
                    <li><strong>Upgrade Path:</strong> the most suitable sequence of upgrades for the given dependency such that other dependencies do not break.</li>
                    <li><strong>Sub-Dependencies:</strong> the dependencies not directly installed by the developer, but that are required by the developer's chosen dependencies.</li>
                    <li><strong>Dependency Integration:</strong> the level at which the files in the repository are integrated/use the various dependencies on the project.</li>
                </ul>
            </div>
            <Canvas id="dependencyVisualizer" url={url} />
        </React.Fragment>;
    }
}

let contentDiv = document.getElementById('content');
ReactDOM.render(<IndexPage />, contentDiv);