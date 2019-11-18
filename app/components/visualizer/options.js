import React from 'react';
import styled from 'styled-components';

const UPGRADE = "Upgrade Path";
const SUB_DEPS = "Sub-Dependencies";
const USAGE = "Usage";

const Options = styled.div`
    align-items: center;
    background-color: white;
    border-radius: 25px;
    display: grid;
    grid-column: 2;
    grid-row: 2;
    grid-template-areas: 
            "top top top"
            "left middle right";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 30% 1fr;
    user-select: none;
`;
const Header = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: xx-large;
    grid-area: top;
    justify-content: center;

    & p {
        margin: 0;
    }
`;
const Opt = styled.div`
    align-items: center;
    box-sizing: border-box;
    display: flex;
    font-size: x-large;
    height: 65%;
    justify-content: center;

    &:hover {
        border-color: black;
        border-radius: 15px;
        border-style: solid;
        border-width: 2px;
        cursor: pointer;
    }
`;
const Opt1 = styled(Opt)`
    grid-area: left;
    margin: 0 0 0 5px;
`;
const Opt2 = styled(Opt)`
    grid-area: middle;
`;
const Opt3 = styled(Opt)`
    grid-area: right;
    margin: 0 5px 0 0;
`;

export const VisualizerOptions = (props) => {
    const { changeVisualization, currentSelection, id } = props;

    return <Options id={id}>
        <Header>
            <p>Choose a visualization for:</p>
            <p>{currentSelection}</p>
        </Header>
        <Opt1 onClick={() => changeVisualization(UPGRADE)}>{UPGRADE}</Opt1>
        <Opt2 onClick={() => changeVisualization(SUB_DEPS)}>{SUB_DEPS}</Opt2>
        <Opt3 onClick={() => changeVisualization(USAGE)}>{USAGE}</Opt3>
    </Options>;
}