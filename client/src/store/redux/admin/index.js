
import { combineReducers } from 'redux';
import requestsReducer from './requestsRedux';
import usersReducer from './usersRedux';

export default combineReducers({
    users: usersReducer,
    requests: requestsReducer,    
});


