import React from 'react';
import styled from 'styled-components';

import VisualizerOptions from './options';

const StyledOverlay = styled.div`
    background-color: rgba(0,0,0,0.5);
    display: grid;
    grid-template-columns: 1fr 65% 1fr;
    grid-template-rows: 1fr 50% 1fr;
    height: 100%;
    position: absolute;
    width: 100%;
    visibility: ${props => (props.showOverlay ? 'visible' : 'hidden')};
    z-index: 10;
`;

export default class Overlay extends React.Component {
    render() {
        return <StyledOverlay showOverlay={this.props.showOverlay}>
            <VisualizerOptions />
        </StyledOverlay>;
    }
}