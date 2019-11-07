import { adminUrl } from '../../../config';
import { of } from 'rxjs/index';
import { ajax } from 'rxjs/ajax'
import { catchError } from 'rxjs/operators';
import { selectors as adminSelectors } from '../redux/adminUserRedux';

/** catches errors before crashing entire epic */
export const getJSON = (state$, path) => {
    const { token } = adminSelectors(state$.value);
    const url = `${adminUrl}/${path}`;
    return ajax.getJSON(url, { Authorization: `bearer ${token}` }).pipe(
        catchError(err => { 
            console.error('catchError', err); 
            return of({ error: err }); 
        })
    );
}
