import React from 'react';

import styles from './formElements.css';

export const Box = (props) => {
    const { id } = props;

    return <input id={id} type="text" className={styles.inputBox} />
};