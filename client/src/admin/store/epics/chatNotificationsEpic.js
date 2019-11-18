import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, catchError } from 'rxjs/operators';
import { postJSON } from './utils';
import { types as connectTypes, selectors as connectSelectors } from '../redux/connectChatRedux';
import { types as usersTypes } from '../redux/usersRedux';
import { types as notificationsTypes, selectors as notificationsSelectors } from '../redux/chatNotificationsRedux';

export const sendNotificationConnectToChat = (action$, state$) => action$.pipe(
    ofType(notificationsTypes.SEND_NOTIFICATION),
    mergeMap(action => {
        const { 
            user: { _id: userId }, 
            chat: { _id: chatId }, 
            request: { _id: requestId }
        } = connectSelectors(state$.value).state;

        const notification = notificationsSelectors(state$.value).state;

        return postJSON(state$, 'notify-chat', { userId, chatId, requestId, notification });
    }),
    mergeMap(data => {
        if (data.error) {
            return of({ type: notificationsTypes.SEND_NOTIFICATION_ERROR, payload: data.error });
        }
        return of(
            { type: notificationsTypes.SEND_NOTIFICATION_SUCCESS, payload: data.response }, /** does nothing */
            { type: usersTypes.UPDATE_USER, payload: data.response }
        );
    }),
    catchError(err => of({ type: notificationsTypes.SEND_NOTIFICATION_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);

