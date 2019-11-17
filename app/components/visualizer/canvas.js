import React from 'react';
import styled from 'styled-components';

import { network } from './network';
import Overlay from './overlay';

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
            newNetwork: true,
            showOverlay: false
        }

        this.toggleOverlay = this.toggleOverlay.bind(this);
    }

    toggleOverlay() {
        const { showOverlay } = this.state;
        this.setState({ showOverlay: !showOverlay });
    }
    
    componentDidUpdate() {
        if (this.state.newNetwork) {
            this.setState({ newNetwork: false });
            network(this.props.id, this.toggleOverlay);
        }
    }
    
    render() {
        const { id } = this.props;
        const { showOverlay } = this.state;

        return <Visualizer>
            <Overlay showOverlay={showOverlay} />
            <StyledCanvas id={id} />
        </Visualizer>;
    }
}