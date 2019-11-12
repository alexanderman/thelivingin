const mock_users = require('../../../._mocks-copy/users.json');

const INITIAL_STATE = {
    list: [], //mock_users,
    filter: undefined,
    orderBy: undefined,
    error: undefined,
    selected: [],    /** sub list of users */
    __isFetching: false
};

export const types = {
    FETCH: 'admin-users-FETCH',
    FETCH_SUCCESS: 'admin-users-FETCH_SUCCESS',
    FETCH_ERROR: 'admin-users-FETCH_ERROR',
    SET_FILTER: 'admin-users-SET_FILTER',
    SET_ORDERBY: 'admin-users-SET_ORDERBY',
    
    SET_SELECTED: 'admin-users-SET_SELECTED',   /** for selected list from api, overrides entire list */
    UPDATE_SELECTED: 'admin-users-UPDATE_SELECTED',   /** used by users table to modify selected users */
};

const isEqual = (u1, u2) => u1._id === u2._id;
const isInList = (list, user) => !!list.filter(u => isEqual(u, user))[0];
const removeFromList = (list, user) => list.filter(u => !isEqual(u, user));

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.FETCH: {
            console.log('## ', types.FETCH);
            return { ...state, __isFetching: true, };
        }

        case types.FETCH_SUCCESS: {
            console.log('## ', types.FETCH_SUCCESS);
            return { ...state, __isFetching: false, list: payload };
        }

        case types.FETCH_ERROR: {
            console.log('## ', types.FETCH_ERROR, payload);
            return { ...state, __isFetching: false, error: payload };
        }

        case types.SET_FILTER: {
            console.log('## ', types.SET_FILTER);
            return { ...state, filter: payload };
        }

        case types.SET_ORDERBY: {
            console.log('## ', types.SET_ORDERBY);
            return { ...state, orderBy: payload };
        }

        case types.SET_SELECTED: {  /** overrides the selected list */
            console.log('## ', types.SET_SELECTED, payload);
            return { ...state, selected: payload };
        }

        case types.UPDATE_SELECTED: {
            console.log('## ', types.UPDATE_SELECTED, payload);
            if (isInList(state.selected, payload)) {
                return { ...state, selected: removeFromList(state.selected, payload) };    
            }
            return { ...state, selected: [...state.selected, payload] };
        }

    }
    return state;
}


export const actions = dispatch => ({
    fetch: () => dispatch({ type: types.FETCH }),
    setSelected: payload => dispatch({ type: types.SET_SELECTED, payload }),
    updateSelected: user => dispatch({ type: types.UPDATE_SELECTED, payload: user }),
});


export const selectors = state => ({
    users: state.admin.users.list,
    filter: state.admin.users.filter,
    orderBy: state.admin.users.orderBy,
    isFetching: state.admin.users.__isFetching,
    selected: state.admin.users.selected,
});
