import React from 'react';

export const Box = (props) => {
    const { id } = props;

    return <input id={id} type="text" />
};