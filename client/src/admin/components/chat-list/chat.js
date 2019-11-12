import React from 'react';
import Timestamp from '../common/timestamp';
import { Paper } from '@material-ui/core';
import './chat.scss';

export default props => {
    const { createdAt, issuedBy } = props.chat;
    const { members } = props;

    return (
        <Paper className="chat-cont">
            <Timestamp className="created-at" timestamp={createdAt}></Timestamp>
            {members 
                ? members.map(m => <a key={m.link} target="_blank" href={m.link}>{m.name} {m.email}</a>)
                : null
            }
        </Paper>
    );
}
