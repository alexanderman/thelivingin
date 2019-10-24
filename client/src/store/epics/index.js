import { combineEpics } from 'redux-observable';
import { connect } from './chatEpic';
import { startup } from './startupEpic';

export default combineEpics(
    startup,
    connect
);
