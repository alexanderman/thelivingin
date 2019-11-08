
import { combineReducers } from 'redux';
import requests from './requestsRedux';
import users from './usersRedux';
import adminUser from './adminUserRedux';
import selectedChat from './selectedChatRedux';
import connectChat from './connectChatRedux';

export default combineReducers({
    adminUser,
    users,
    requests,
    selectedChat,
    connectChat,
});


