import { combineEpics } from 'redux-observable';
import { createConnection, receiveMessages, sendMessage, getPreviousMessages } from './chatEpic';
import { startup } from './startupEpic';

export default combineEpics(
    startup,
    createConnection,
    receiveMessages,
    sendMessage,
    getPreviousMessages
);
