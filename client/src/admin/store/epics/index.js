import { combineEpics } from 'redux-observable';
import { fetchRequests } from './requestsEpic';
import { fetchUsers } from './usersEpic';
import { fetchChatsByRequestId, listenToSelectedRequest } from './chatEpic';

export default combineEpics(
    fetchRequests,
    fetchUsers,
    fetchChatsByRequestId,
    listenToSelectedRequest,
);
