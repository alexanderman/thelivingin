
import { combineReducers } from 'redux';
import requestsReducer from './requestsRedux';
import usersReducer from './usersRedux';
import adminUser from './adminUserRedux';

export default combineReducers({
    adminUser,
    users: usersReducer,
    requests: requestsReducer,    
});


