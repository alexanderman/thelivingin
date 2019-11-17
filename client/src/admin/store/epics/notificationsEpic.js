import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { postJSON } from './utils';
import { types, selectors } from '../redux/connectChatRedux';
import { types as usersTypes } from '../redux/usersRedux';

export const sendNotificationConnectToChat = (action$, state$) => action$.pipe(
    ofType(types.SEND_NOTIFICATION),
    mergeMap(action => {
        const { 
            user: { _id: userId }, 
            chat: { _id: chatId }, 
            request: { _id: requestId },
            notification
        } = selectors(state$.value).state;
        return postJSON(state$, 'notify-chat', { userId, chatId, requestId, notification });
    }),
    mergeMap(data => {
        if (data.error) {
            return of({ type: types.SEND_NOTIFICATION_ERROR, payload: data.error });
        }
        return of(
            { type: types.SEND_NOTIFICATION_SUCCESS, payload: data.response }, /** does nothing */
            { type: types.SET_USER, payload: undefined }, /** will close connect popup */
            { type: usersTypes.UPDATE_USER, payload: data.response }
        );
    }),
    catchError(err => of({ type: types.SEND_NOTIFICATION_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);

