import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './redux';
import rootEpic from './epics';


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
