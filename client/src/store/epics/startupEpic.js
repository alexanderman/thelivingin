import { apiUrl } from '../../config';
import { ajax } from 'rxjs/ajax'
import { of } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, take, catchError } from 'rxjs/operators';

import { types as chatTypes } from '../redux/chatRedux';
import { types as userTypes } from '../redux/userRedux';


/**
 * TODO
 *  - pass actoin down the pipe chain to handle error correctly in chatRedux, need the chatId for the error
 */

export const startup = action$ => action$.pipe(
    ofType(chatTypes.FETCH_CHAT),
    take(1),
    mergeMap(action => {
        const { payload: { chatId, userId, requestId, sig } } = action;
        console.log(`fetching user and chat data for ${chatId}; ${userId}; ${requestId}; ${sig}`);
        const url = `${apiUrl}/chats/${chatId}?userId=${userId}&requestId=${requestId}&sig=${sig}`;
        return ajax.getJSON(url);
    }),
    mergeMap(serverData => {
        const { user, chat, request, twilioToken } = serverData;
        const { _id: chatId, twilio: { sid } } = chat;
        return of(
            { type: userTypes.INIT_USER, payload: { ...user, twilioToken } },
            { type: chatTypes.FETCH_CHAT_SUCCESS, payload: { chat, request } },
            { type: chatTypes.CONNECT_CHANNEL, payload: { chatId, channelSid: sid, twilioToken } },
        );
    }),
    catchError(err => of({ type: chatTypes.FETCH_CHAT_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);
