import { of, from } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, take, catchError } from 'rxjs/operators';
import { types } from '../redux/chatRedux';
import { createChannelConnection } from '../../services/twilio-service';

export const connect = action$ => action$.pipe(
    ofType(types.INIT_CHANNEL),
    take(1),
    mergeMap(action => {
        const { payload: { channelSid, twilioToken } } = action;
        console.log('connecting to channel', channelSid);
        return from(createChannelConnection(channelSid, twilioToken));
    }),
    map(connection => {
        window.connection = connection;
        return { type: types.INIT_CHANNEL_SUCCESS };
    }),
    catchError(err => of({ type: types.INIT_CHANNEL_ERROR, payload: err.message }))
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