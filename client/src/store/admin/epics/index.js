import { combineEpics } from 'redux-observable';
import { fetchRequests } from './requestsEpic';
import { fetchUsers } from './usersEpic';

export default combineEpics(
    fetchRequests,
    fetchUsers,
);
