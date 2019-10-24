import { ajax } from 'rxjs/ajax'
import { of, Observable } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, mapTo, take, catchError } from 'rxjs/operators';
import { types } from '../redux/chatRedux';


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

export const onStartup = action$ => action$.pipe(
    ofType('startup'),
    take(1),
    mergeMap(action => {
        console.log('started listening...');
        return listen$;
    }),
    map(message => ({ type: 'onMessage', payload: message })),
    catchError(err => of({ type: 'error', payload: err.message }))
);
