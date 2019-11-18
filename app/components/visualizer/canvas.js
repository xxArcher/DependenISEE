import React from 'react';
import styled from 'styled-components';

import { network } from './network';
import { OptionsOverlay } from './overlay';

const StyledCanvas = styled.div`
    height: 100%;
    & div:focus,
    canvas:focus {
        outline: 0;
    }
`;

const Visualizer = styled.div`
    border-color: black;
    border-width: 0 0 0 3px;
    border-style: solid;
    box-sizing: border-box;
    grid-area: vis;
    height: 100%;
    position: relative;
`;

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentSelection: null,
            currentVisualization: "dependencies",
            newNetwork: true,
            showOverlay: false
        }

        this.changeVisualization = this.changeVisualization.bind(this);
        this.clickOnNode = this.clickOnNode.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
    }

    changeSelection(selection) {
        this.setState ({ currentSelection: selection });
    }

    changeVisualization(visualization) {
        this.setState ({ currentVisualization: visualization, newNetwork: true, showOverlay: false });
    }

    clickOnNode(name) {
        this.changeSelection(name);
        this.toggleOverlay();
    }
    
    componentDidUpdate(prevState) {
        if (this.state.newNetwork) {
            this.setState({ newNetwork: false });
            const { currentSelection, currentVisualization } = this.state;
            network(this.props.id, this.clickOnNode, currentSelection);
        }
    }

    toggleOverlay() {
        const { showOverlay } = this.state;
        this.setState({ showOverlay: !showOverlay });
    }
    
    render() {
        const { id } = this.props;
        const { showOverlay, currentSelection } = this.state;

        return <Visualizer>
            <OptionsOverlay changeVisualization={this.changeVisualization}
                currentSelection={currentSelection}
                showOverlay={showOverlay} 
                toggleOverlay={this.toggleOverlay}  />
            <StyledCanvas id={id} />
        </Visualizer>;
    }
}