import { combineEpics } from 'redux-observable';
import { createConnection, receiveMessages, sendMessage, getPreviousMessages } from './chatEpic';
import { startup } from './startupEpic';
import adminEpics from '../admin/epics';

export default combineEpics(
    startup,
    createConnection,
    receiveMessages,
    sendMessage,
    getPreviousMessages,
    adminEpics
);
