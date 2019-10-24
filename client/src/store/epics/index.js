import { combineEpics } from 'redux-observable';
import { onStartup } from './chatEpic';

export default combineEpics(
    onStartup
);
