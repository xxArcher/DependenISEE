import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    line-height: 1.5em;
    margin: 5px;
    padding: 0 10px;
    user-select: none;
`;

export const Button = (props) => {
    const { form, label } = props;

    return <StyledButton form={form}>{label}</StyledButton>;
}