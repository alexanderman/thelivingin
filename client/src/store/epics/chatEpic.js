import { of, from, Observable, timer } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, take, catchError, debounce } from 'rxjs/operators';
import { types } from '../redux/chatRedux';
import { createChannelConnection } from '../../services/twilio-service';

let _connection;

export const createConnection = action$ => action$.pipe(
    ofType(types.CONNECT_CHANNEL),
    take(1),    /** take once to create single connection */
    mergeMap((action) => {
        const { payload: { chatId, channelSid, twilioToken } } = action;
        return from(createChannelConnection(chatId, channelSid, twilioToken));
    }),
    mergeMap(connection => {
        _connection = window.__connection = connection; // debug code window.__connection
        return from(connection.getPreviousMessages());
    }),
    map(lastMessages => {
        return { type: types.CONNECT_CHANNEL_SUCCESS, payload: lastMessages };
    }),
    catchError(err => of({ type: types.CONNECT_CHANNEL_ERROR, payload: err.message }))
);

export const receiveMessages = action$ => action$.pipe(
    ofType(types.CONNECT_CHANNEL_SUCCESS),
    take(1),    /** take once --> only to create the new Observable */
    mergeMap(action => {
        return new Observable(observer => {
            _connection.listen(message => {
                observer.next(message);
            });
        });
    }),
    map(message => {
        return { type: types.RECEIVE_MESSAGE, payload: message };
    }),
    catchError(err => of({ type: types.CONNECT_CHANNEL_ERROR, payload: err.message }))
);

export const getPreviousMessages = action$ => action$.pipe(
    ofType(types.FETCH_PREVIOUS_MESSAGES),
    debounce(() => timer(500)), // TODO: temporary solution for infinit request
    mergeMap(action => {
        return new Observable(observer => {
            /** swallowing the error */
            _connection.getPreviousMessages().then(messages => {
                observer.next(messages);
            }).catch(console.error);
        });
    }),
    map(messages => ({ type: types.FETCH_PREVIOUS_MESSAGES_SUCCESS, payload: messages })),
    catchError(err => of({ type: types.FETCH_PREVIOUS_MESSAGES_ERROR, payload: err.message }))
);

export const sendMessage = action$ => action$.pipe(
    ofType(types.SEND_MESSAGE),
    mergeMap(action => {
        const { payload: { message, user } } = action;
        return new Observable(observer => {
            /** swallowing an error, not letting it kill the epic, when reaches catchError */
            /** TODO: add user avatar here */
            const { canHelp, _id, name } = user;
            _connection.sendMessage(message, { sender: { canHelp, _id, name } })
            .then(msgIdx => observer.next(msgIdx))
            .catch(err => {
                console.error(err); // TODO: global error handler + retry ?
            });
        });
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