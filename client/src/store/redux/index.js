import { combineReducers } from 'redux';
import chatReducer from './chatRedux';
import userReducer from './userRedux';

import adminReducer from './admin';

export default combineReducers({
    user: userReducer,
    chat: chatReducer,    
    admin: adminReducer
});


