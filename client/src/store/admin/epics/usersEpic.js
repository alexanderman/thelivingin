import { adminUrl } from '../../../config';
import { ajax } from 'rxjs/ajax'
import { of } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError, take } from 'rxjs/operators';

import { types as usersTypes } from '../redux/usersRedux';
import { selectors as usersSelectors } from '../redux/usersRedux';
import { selectors as adminSelectors } from '../redux/adminUserRedux';

function tryObseravable(observable$) {
    return observable$.catchError(err => { 
        console.error(err); 
        return of({ error: err }); 
    });
}


export const fetchUsers = (action$, state$) => action$.pipe(
    ofType(usersTypes.FETCH),
    take(1),
    mergeMap(action => {
        /** TODO: connect filter and orderBy + add epic that reacts on change in those with usersTypes.FETCH */
        console.log(state$);
        const { state } = state$.value;
        console.log(state);
        const { filter, orderdBy } = usersSelectors(state);
        const { token } = adminSelectors(state);
        return tryObseravable(
            ajax.getJSON(`${adminUrl}/users`, { Authorization: `bearer ${token}` })
        );
    }),
    map(data => {
        if (data.error) {
            return { type: usersTypes.FETCH_ERROR, payload: data.error };
        }
        return { type: usersTypes.FETCH_SUCCESS, payload: data };
    }),
    catchError(err => of({ type: usersTypes.FETCH_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);
