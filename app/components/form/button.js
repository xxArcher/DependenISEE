import React from 'react';

export const Button = (props) => {
    const { form, label } = props;
    return <button form={form}>{label}</button>;
}