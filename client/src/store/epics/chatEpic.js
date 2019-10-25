import { of, from, Observable } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, take, catchError } from 'rxjs/operators';
import { types } from '../redux/chatRedux';
import { createChannelConnection } from '../../services/twilio-service';

let _connection;

export const createConnection = action$ => action$.pipe(
    ofType(types.CONNECT_CHANNEL),
    take(1),
    mergeMap((action) => {
        const { payload: { chatId, channelSid, twilioToken } } = action;
        return from(createChannelConnection(chatId, channelSid, twilioToken));
    }),
    map(connection => {
        _connection = window.connection = connection; // debug code window.connection
        // const listener$ = createListener(connection);
        return { type: types.CONNECT_CHANNEL_SUCCESS };
    }),
    catchError(err => of({ type: types.CONNECT_CHANNEL_ERROR, payload: err.message }))
);

export const receiveMessages = action$ => action$.pipe(
    ofType(types.CONNECT_CHANNEL_SUCCESS),
    take(1),
    mergeMap(action => {
        return new Observable(observer => {
            _connection.listen(message => {
                observer.next(message);
            });
        });
    }),
    map(message => {
        console.log('message received', message);
        return { type: types.RECEIVE_MESSAGE, payload: message };
    }),
    catchError(err => of({ type: types.CONNECT_CHANNEL_ERROR, payload: err.message }))
);

export const sendMessage = action$ => action$.pipe(
    ofType(types.SEND_MESSAGE),
    mergeMap(action => {
        const { payload } = action;
        return from(_connection.sendMessage(payload));
    }),
    map(sendRes => {
        return { type: types.SEND_MESSAGE_SUCCESS, payload: sendRes };
    }),
    catchError(err => of({ type: types.SEND_MESSAGE_ERROR, payload: err.message }))
);

/* working test code
function listen(num, onMessage = () => {}) {
    let c = 0;
    const intr = setInterval(() => {
        if (++c >= num) clearInterval(intr);
        onMessage(c);
    }, 200);
}

const listen$ = new Observable(observer => {
    listen(10, m => {
        observer.next(m);
        if (m === 10) observer.complete();
    });
});

export const connect = action$ => action$.pipe(
    ofType('startupXXX'),
    take(1),
    mergeMap(action => {
        console.log('started listening...');
        return listen$;
    }),
    map(message => ({ type: 'onMessage', payload: message })),
    catchError(err => of({ type: 'error', payload: err.message }))
);
*/