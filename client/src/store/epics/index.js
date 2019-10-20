import { combineEpics } from 'redux-observable';
import { sendMessage } from './chatEpic';

export default combineEpics(
    sendMessage
);
