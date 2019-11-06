import { adminUrl } from '../../../config';
import { ajax } from 'rxjs/ajax'
import { of } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError, take, tap, throttleTime } from 'rxjs/operators';

import { types as usersTypes } from '../redux/usersRedux';
import { selectors as usersSelectors } from '../redux/usersRedux';
import { selectors as adminSelectors, actions } from '../redux/adminUserRedux';

function safeObseravable(observable$) {
    return observable$.pipe(
        catchError(err => { 
            console.error('catchError', err); 
            return of({ error: err }); 
        })
    );
}


export const fetchUsers = (action$, state$) => action$.pipe(
    ofType(usersTypes.FETCH),
    mergeMap(action => {
        /** TODO: connect filter and orderBy + add epic that reacts on change in those with usersTypes.FETCH */
        const { filter, orderdBy } = usersSelectors(state$.value);
        const { token } = adminSelectors(state$.value);
        return safeObseravable(
            ajax.getJSON(`${adminUrl}/users`, { Authorization: `bearer ${token}` })
        );
    }),
    map(data => {
        if (!data || data.error) {
            return { type: usersTypes.FETCH_ERROR, payload: data ? data.error : data };
        }
        return { type: usersTypes.FETCH_SUCCESS, payload: data };
    }),
    catchError(err => of({ type: usersTypes.FETCH_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);
