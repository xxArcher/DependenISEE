import React from 'react';
import styled from 'styled-components';

import { network } from './network';

const StyledCanvas = styled.div`
    border-color: black;
    border-width: 0 0 0 3px;
    border-style: solid;
    box-sizing: border-box;
    grid-area: vis;
    height: 100%;

    & div:focus,
    canvas:focus {
        outline: 0;
    }
`;

export default class Canvas extends React.Component {
    componentDidUpdate() {
        network(this.props.id);
    }
    
    render() {
        const { id } = this.props;

        return <StyledCanvas id={id} />;
    }
}