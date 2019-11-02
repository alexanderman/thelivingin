import { apiUrl } from '../../../config';
import { ajax } from 'rxjs/ajax'
import { of } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, take, catchError } from 'rxjs/operators';

import { types as requestsTypes } from '../../redux/admin/requestsRedux';


export const fetchRequests = action$ => action$.pipe(
    ofType(requestsTypes.FETCH),
    mergeMap(action => {
        /** TODO: set correct url */
        // const { payload: { chatId, userId, requestId, sig } } = action;
        // console.log(`fetching user and chat data for ${chatId}; ${userId}; ${requestId}; ${sig}`);
        // const url = `${apiUrl}/chats/${chatId}?userId=${userId}&requestId=${requestId}&sig=${sig}`;
        // return ajax.getJSON(url);
    }),
    mergeMap(serverData => {
        // const { user, chat, request, twilioToken } = serverData;
        // const { _id: chatId, twilio: { sid } } = chat;
        // return of(
        //     { type: userTypes.INIT_USER, payload: { ...user, twilioToken } },
        //     { type: chatTypes.FETCH_CHAT_SUCCESS, payload: { chat, request } },
        //     { type: chatTypes.CONNECT_CHANNEL, payload: { chatId, channelSid: sid, twilioToken } },
        // );
    }),
    catchError(err => of({ type: requestsTypes.FETCH_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);
