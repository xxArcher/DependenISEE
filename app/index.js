import React from 'react';
import ReactDOM from 'react-dom';

class IndexPage extends React.Component {
    render() {
        return <p>Testing</p>;
    }
}

let contentDiv = document.getElementById('content');
ReactDOM.render(<IndexPage />, contentDiv);