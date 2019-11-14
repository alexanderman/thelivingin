import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import appReducer from './redux';
import appEpic from './epics';

import adminReducer from '../admin/store/redux';
import adminEpic from '../admin/store/epics';

const rootEpic = combineEpics(
    appEpic,
    adminEpic,
);

const rootReducer = combineReducers({
    admin: adminReducer,
    app: appReducer,    
});

const epicMiddleware = createEpicMiddleware();

export default function configureStore() {
    /** TODO: remove devtools for production build 
     * http://extension.remotedev.io/#usage */
    const store = createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(epicMiddleware)),
    );
    epicMiddleware.run(rootEpic);
    return store;
}
