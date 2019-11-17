import React from 'react';
import styled from 'styled-components';

import { Box } from '../form/box';
import { Button } from '../form/button';

const Description = styled.div`
    align-self: normal;
    display: flex;
    flex-direction: column;
    grid-area: lower;
    padding: 5px;
    text-align: left;

    & p {
        text-indent: 2em;
    }
`;
const Title = styled.p`
    font-size: xx-large;
    margin: 15px;
    user-select: none;
`;
const UpperContent = styled.div`
    grid-area: upper;
`;

export default class SidePanel extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { getRepoSubmit } = this.props;

        const upperContent = <UpperContent>
            <Title>Visualize a Repository's Dependencies</Title>
            <form id="getGitRepo" onSubmit={getRepoSubmit}>
                <Box id="repoUrl"/>
                <Button label="Visualize" form="getGitRepo"/>
            </form>
        </UpperContent>;

        return <React.Fragment>
            {upperContent}
            <Description>
                <p>Enter a Github repository URL and click submit. You will be greeted with a visualization of your repository's dependencies. Clicking on an individual node will allow you to visualize the following:</p>
                <ul>
                    <li><strong>Upgrade Path:</strong> the most suitable sequence of upgrades for the given dependency such that other dependencies do not break.</li>
                    <li><strong>Sub-Dependencies:</strong> the dependencies not directly installed by the developer, but that are required by the developer's chosen dependencies.</li>
                    <li><strong>Dependency Integration:</strong> the level at which the files in the repository are integrated/use the various dependencies on the project.</li>
                </ul>
            </Description>
        </React.Fragment>
    }
}
