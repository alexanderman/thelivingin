import { apiUrl } from '../../config';
import { ajax } from 'rxjs/ajax'
import { of, Observable } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, mapTo, take, catchError } from 'rxjs/operators';

import { types as chatTypes } from '../redux/chatRedux';
import { types as userTypes } from '../redux/userRedux';


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
        console.log('serverData', serverData);
        const { user, chat, request, twilioToken } = serverData;
        const { twilio: { sid } } = chat;
        return of(
            { type: userTypes.INIT_USER, payload: user },
            { type: chatTypes.FETCH_CHAT_SUCCESS, payload: { chat, request, twilioToken } },
            { type: chatTypes.INIT_CHANNEL, payload: { channelSid: sid, twilioToken } },
        );
    }),
    catchError(err => of({ type: chatTypes.FETCH_CHAT_ERRORs, payload: err }))
);
