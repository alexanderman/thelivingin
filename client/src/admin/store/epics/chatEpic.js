import { of } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, takeUntil, map, catchError } from 'rxjs/operators';
import { getJSON } from './utils';

import { types as connectTypes } from '../redux/connectChatRedux'
import { types as requestChatsTypes } from '../redux/requestChatsRedux';

/** reacts on request selection and dispatches fetch chats */
export const listenToSelectedRequest = (action$, state$) => action$.pipe(
    ofType(connectTypes.SET_REQUEST),
    map(action => {
        const { payload } = action;
        if (payload) {
            return { type: requestChatsTypes.FETCH, payload };
        }
        return { type: requestChatsTypes.FETCH_CANCEL }
    })
);

export const fetchChatsByRequestId = (action$, state$) => action$.pipe(
    ofType(requestChatsTypes.FETCH),
    mergeMap(action => {
        const { payload: request } = action;
        const filter = JSON.stringify([{ key: 'requestId', operator: '==', operand: request._id }]);
        const path = `chats?filter=${encodeURIComponent(filter)}`;

        return getJSON(state$, path).pipe(
            takeUntil(action$.pipe(
                ofType(requestChatsTypes.FETCH, requestChatsTypes.FETCH_CANCEL)
            )),
        );
    }),
    mergeMap(data => {
        if (!data || data.error) {
            return of({ type: requestChatsTypes.FETCH_ERROR, payload: data ? data.error : data });
        }
        return of(
            { type: requestChatsTypes.FETCH_SUCCESS, payload: data },
            /** for now single chat per request -> setting connect selected automatically */
            { type: connectTypes.SET_CHAT, payload: data[0] }, 
        ); 
    }),
    catchError(err => of({ type: requestChatsTypes.FETCH_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);

