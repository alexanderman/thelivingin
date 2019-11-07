
import { combineReducers } from 'redux';
import requests from './requestsRedux';
import users from './usersRedux';
import adminUser from './adminUserRedux';
import selectedChat from './selectedChatRedux';

export default combineReducers({
    adminUser,
    users,
    requests,
    selectedChat
});


