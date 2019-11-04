import { adminUrl } from '../../../config';
import { ajax } from 'rxjs/ajax'
import { of } from 'rxjs/index';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { types as requestsTypes } from '../redux/requestsRedux';
import { selectors as requestsSelectors } from '../redux/requestsRedux';
import { selectors as adminSelectors } from '../redux/adminUserRedux';

function safeObseravable(observable$) {
    return observable$.pipe(
        catchError(err => { 
            console.error('catchError', err); 
            return of({ error: err }); 
        })
    );
}


export const fetchRequests = (action$, state$) => action$.pipe(
    ofType(requestsTypes.FETCH),
    mergeMap(action => {
        /** TODO: connect filter and orderBy + add epic that reacts on change in those with requestsTypes.FETCH */
        const { filter, orderdBy } = requestsSelectors(state$.value);
        const { token } = adminSelectors(state$.value);
        return safeObseravable(
            ajax.getJSON(`${adminUrl}/requests`, { Authorization: `bearer ${token}` })
        );
    }),
    map(data => {
        if (data.error) {
            return { type: requestsTypes.FETCH_ERROR, payload: data.error };
        }
        return { type: requestsTypes.FETCH_SUCCESS, payload: data };
    }),
    catchError(err => of({ type: requestsTypes.FETCH_ERROR, payload: `${err.message}; ${JSON.stringify(err.response)}` }))
);
