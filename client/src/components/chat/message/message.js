import React from 'react';
import './message.scss';

export default props => {
    const { message, userId } = props;
    const { author, body, channelSid, chatId, attributes = {} } = message;
    const { _id: senderId, name } = attributes.sender || {};

    const messageLineClass = userId == senderId ? 'message-line me' : 'message-line';

    return (
        <div className={messageLineClass}>
            <div className="message-content">
                <div className="user">{name}</div>
                <div className="message">{body}</div>
            </div>
        </div>
    )
}