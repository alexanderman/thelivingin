import React from 'react';
import { connect } from 'react-redux';
import Chat from './chat';
import { Card, CardContent } from '@material-ui/core';
import { selectors as usersSelectors } from '../../store/redux/usersRedux';
import { selectors as requestChats } from '../../store/redux/requestChatsRedux';
import { selectors as connectSelectors } from '../../store/redux/connectChatRedux';

import './chat-list.scss'

const ChatList = props => {
    const { usersSelectors: { users: userList }, requestChats, connectSelectors: { request } } = props;
    const { chats } = requestChats;

    if (!chats || !chats.length || !request) {
        return null;
    }

    console.log(request);

    const chatMembersUrls = chat => {
        const { members } = chat.twilio || {};
        if (!members) return null;

        return userList.filter(u => !!members[u._id])
            .map(u => ({
                name: u.name, 
                email: u.email,
                link: `../?chatId=${chat._id}&userId=${u._id}&requestId=${request._id}&sig=0`,
            }));
    }

    return (
        <Card>
            <CardContent className="chat-list-cont">
                {chats.map(chat => <Chat key={chat._id} chat={chat} members={chatMembersUrls(chat)} />)}
            </CardContent>
        </Card>
    )
}

const mapStateToProps = state => ({
    usersSelectors: usersSelectors(state),
    requestChats: requestChats(state),
    connectSelectors: connectSelectors(state),
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
