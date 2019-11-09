
import { combineReducers } from 'redux';
import requests from './requestsRedux';
import users from './usersRedux';
import adminUser from './adminUserRedux';
import requestChatsRedux from './requestChatsRedux';
import connectChat from './connectChatRedux';

export default combineReducers({
    adminUser,
    users,
    requests,
    requestChatsRedux,
    connectChat,
});


