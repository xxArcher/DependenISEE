import React from 'react';

import { network } from './network';

export default class Canvas extends React.Component {
    componentDidUpdate() {
        network(this.props.id);
    }
    
    render() {
        const { id } = this.props;

        return <div id={id}></div>;
    }
}