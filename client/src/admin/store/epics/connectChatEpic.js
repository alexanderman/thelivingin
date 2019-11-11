import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { postJSON } from './utils';
import { types, selectors } from '../redux/connectChatRedux';
import { types as requestChatsTypes } from '../redux/requestChatsRedux';

export const sendConnectUserToChat = (action$, state$) => action$.pipe(
    ofType(types.SEND_CONNECT),
    mergeMap(action => {
        const postData = selectors(state$.value).state;
        return postJSON(state$, 'chats/addmember', postData);
    }),
    mergeMap(data => {
        if (data.error) {
            return of({ type: types.SEND_CONNECT_ERROR, payload: data.error });
        }
        return of(
            { type: types.SEND_CONNECT_SUCCESS, payload: data.response }, /** does nothing */
            { type: types.SET_CHAT, payload: data.response },
            { type: types.SET_USER, payload: undefined }, /** will close connect popup */
            { type: requestChatsTypes.UPDATE_CHAT, payload: data.response }
        );
    }),
    catchError(err => of({ type: types.SEND_CONNECT_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);

export const sendDisconnectUserFromChat = (action$, state$) => action$.pipe(
    ofType(types.SEND_DICSONNECT),
    mergeMap(action => {
        const postData = selectors(state$.value).state;
        return postJSON(state$, 'chats/removemember', postData);
    }),
    map(data => {
        if (data.error) {
            return { type: types.SEND_DICSONNECT_ERROR, payload: data.error };
        }
        return { type: types.SEND_DICSONNECT_SUCCESS, payload: data };
    }),
    catchError(err => of({ type: types.SEND_DICSONNECT_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);
