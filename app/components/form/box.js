import React from 'react';
import styled from 'styled-components';

const StyledBox = styled.input`
    line-height: 1.5em;
    margin: 5px;
    width: 70%;
`;

export const Box = (props) => {
    const { id } = props;

    return <StyledBox id={id} type="text" />
};