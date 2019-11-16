import React from 'react';

import { network } from './network';

import styles from './canvas.css';

export default class Canvas extends React.Component {
    componentDidUpdate() {
        network(this.props.id);
    }
    
    render() {
        const { id } = this.props;

        return <div id={id} className={styles.canvas}></div>;
    }
}