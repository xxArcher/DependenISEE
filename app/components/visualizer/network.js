import vis from'vis-network';
import _ from 'lodash';

const mockData = require('./mockdata.json');
const dependencies = mockData.dependencies;
const devDependencies = mockData.devDependencies;

const getTopLevelDependencies = () => {
    return [... _.keys(dependencies), ... _.keys(devDependencies)];
}

const getDependenciesFor = (dependency) => {
    return dependencies[dependency] || devDependencies[dependency];
}

export const network = (canvasId, onNodeClick, currentSelection) => {
    const ids = currentSelection == null ? getTopLevelDependencies() : getDependenciesFor(currentSelection);

    let data = { nodes: makeNodes(ids, "Node"), edges: new vis.DataSet({}) };
    const options = {};
    const container = document.getElementById(canvasId);
    let network = new vis.Network(container, data, options);
    network.on ('click', (ev) => {
        const nodes = ev.nodes;
        if (nodes.length != 0) {
            const clickedNode = nodes[0];
            onNodeClick(clickedNode);
        }
    });
};

const makeEdges = (edgeLabels) => {
    const options = {};
    let edges = new vis.DataSet(options);
    _.forEach(edgeLabels, (val) => {
        edges.add([{ from: val[0], to: val[1] }]);
    });
    return edges;
};

const makeNodes = (ids) => {
    const options = {};
    let nodes = new vis.DataSet(options);
    _.forEach(ids, (val) => {
        nodes.add([{ id: val, label: val }]);
    });
    return nodes;
};