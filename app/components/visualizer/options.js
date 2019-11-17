import React from 'react';
import styled from 'styled-components';

const Options = styled.div`
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
    opacity: 100%!important;
`;
const Header = styled.div`
    align-items: center;
    display: flex;
    font-size: xx-large;
    grid-area: top;
    justify-content: center;
`;
const Opt = styled.div`
    align-items: center;
    display: flex;
    font-size: x-large;
    justify-content: center;
`;
const Opt1 = styled(Opt)`
    grid-area: left;
`;
const Opt2 = styled(Opt)`
    grid-area: middle;
`;
const Opt3 = styled(Opt)`
    grid-area: right;
`;

export default class VisualizerOptions extends React.Component {
    render() {
        return <Options>
            <Header>Choose a visualization</Header>
            <Opt1>Upgrade Path</Opt1>
            <Opt2>Sub-Dependencies</Opt2>
            <Opt3>Usage</Opt3>
        </Options>;
    }
}