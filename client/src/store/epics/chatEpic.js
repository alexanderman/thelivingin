import { ajax } from 'rxjs/ajax'
import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { types } from '../redux/chatRedux';


/** simulating message receive */
import { interval } from 'rxjs';
// interval(1000).subscribe(x => console.log(x));

export const sendMessage = action$ => action$.pipe(
    ofType(types.SEND_MESSAGE),
    mergeMap(action => {
        /**  */
    })
);

