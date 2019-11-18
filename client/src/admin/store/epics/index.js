import { combineEpics } from 'redux-observable';
import { fetchRequests } from './requestsEpic';
import { fetchUsers } from './usersEpic';
import { fetchChatsByRequestId, listenToSelectedRequest } from './chatEpic';
import { sendConnectUserToChat, sendDisconnectUserFromChat } from './connectChatEpic';
import { sendNotificationConnectToChat, sendNotificationNewMessages } from './chatNotificationsEpic';

export default combineEpics(
    fetchRequests,
    fetchUsers,
    fetchChatsByRequestId,
    listenToSelectedRequest,
    sendConnectUserToChat,
    sendDisconnectUserFromChat,
    sendNotificationConnectToChat,
    sendNotificationNewMessages,
);
