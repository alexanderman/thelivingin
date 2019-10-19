import { combineReducers } from 'redux';
import chatReducer from './chatRedux';
import userReducer from './userRedux';

export default combineReducers({
    user: userReducer,
    chat: chatReducer
});
