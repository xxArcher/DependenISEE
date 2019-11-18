import React from 'react';
import styled from 'styled-components';

import { VisualizerOptions } from './options';

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

const handleCloseFromClickOutside = (ev, toggleOverlay) => {
    const clickX = ev.clientX;
    const clickY = ev.clientY; 
    if (clickX !== 0 && clickY !== 0) {
        const optionsContainer = document.getElementById("visualizerOptions");
        let containerRect = optionsContainer.getBoundingClientRect();
        let clickInsideContainer = clickX > containerRect.left && clickX < containerRect.right &&
                                    clickY > containerRect.top && clickY < containerRect.bottom;
        !clickInsideContainer && toggleOverlay();
    }
};

export const OptionsOverlay = (props) => {
    const { changeVisualization, currentSelection, showOverlay, toggleOverlay } = props;
    
    return <StyledOverlay showOverlay={showOverlay} 
        onMouseDown={(ev) => handleCloseFromClickOutside(ev, toggleOverlay)}>
        <VisualizerOptions changeVisualization={changeVisualization}
            currentSelection={currentSelection}
            id="visualizerOptions" />
    </StyledOverlay>;
}