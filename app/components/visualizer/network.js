import vis from'vis-network';
import _ from 'lodash';

export const network = (canvasId, onClick) => {
    const ids = [...Array(5).keys()];
    const edges = [
        [ids[0],ids[1]],
        [ids[1],ids[2]],
        [ids[2],ids[3]],
        [ids[2],ids[4]],
        [ids[0],ids[4]]
    ];
    const data = { nodes: makeNodes(ids, "Node"), edges: makeEdges(edges) };
    const options = {};
    const container = document.getElementById(canvasId);
    const network = new vis.Network(container, data, options);
    network.on ('click', (ev) => {
        const nodes = ev.nodes;
        if (nodes.length != 0) {
            const clickedNode = nodes[0];
            onClick();
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

const makeNodes = (ids, prefix) => {
    const options = {};
    let nodes = new vis.DataSet(options);
    _.forEach(ids, (val) => {
        const label = prefix + " " + val;
        nodes.add([{ id: val, label }]);
    });
    return nodes;
};