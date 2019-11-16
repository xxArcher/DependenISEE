import React from 'react';

import styles from './formElements.css';

export const Button = (props) => {
    const { form, label } = props;
    return <button form={form} className={styles.inputButton}>{label}</button>;
}