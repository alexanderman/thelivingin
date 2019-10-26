import React from 'react';
import './message.scss';

export default props => {
    const { message, userId } = props;
    const { author, body, channelSid, chatId, attributes = {} } = message;
    const { userId: senderId } = attributes;

    const messageLineClass = userId == senderId ? 'message-line me' : 'message-line';

    return (
        <div className={messageLineClass}>
            <div className="message-content">
                <div className="user">{attributes.userId}</div>
                <div className="message">{body}</div>
            </div>
        </div>
    )
}