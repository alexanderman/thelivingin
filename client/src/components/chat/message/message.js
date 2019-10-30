import React from 'react';
import './message.scss';

function _isUrl(text) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
        .test(text);
}

export default props => {
    const { message, userId } = props;
    const { author, body, channelSid, chatId, attributes = {} } = message;
    const { _id: senderId, name } = attributes.sender || {};

    const messageLineClass = userId === senderId ? 'message-line me' : 'message-line';
    const isUrl = _isUrl(body);

    return (
        <div className={messageLineClass}>
            <div className="message-content">
                <div className="user">{name}</div>
                {!isUrl 
                    ? <div className="message">{body}</div>    
                    : <div className="message">
                        <a target="_blank" rel="noopener noreferrer" href={body}>{body}</a>
                    </div>    
                }
                
            </div>
        </div>
    )
}