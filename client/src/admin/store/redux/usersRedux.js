const mock_users = require('../../_mocks/mock_users.json');

const INITIAL_STATE = {
    list: mock_users,
    filter: undefined,
    orderBy: undefined,
    error: undefined,
    selected: undefined,
    __isFetching: false
};

export const types = {
    FETCH: 'admin-users-FETCH',
    FETCH_SUCCESS: 'admin-users-FETCH_SUCCESS',
    FETCH_ERROR: 'admin-users-FETCH_ERROR',
    SET_FILTER: 'admin-users-SET_FILTER',
    SET_ORDERBY: 'admin-users-SET_ORDERBY',
    SET_SELECTED: 'admin-users-SET_SELECTED',
};

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
            // return { ...state, __isFetching: false, list: [...payload,...payload,...payload,...payload,...payload,...payload,] };
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

        case types.SET_SELECTED: {
            console.log('## ', types.SET_SELECTED, payload);
            return { ...state, selected: payload };
        }

    }
    return state;
}


export const actions = dispatch => ({
    fetch: () => dispatch({ type: types.FETCH }),
    setSelected: payload => dispatch({ type: types.SET_SELECTED, payload }),
});


export const selectors = state => ({
    users: state.admin.users.list,
    filter: state.admin.users.filter,
    orderBy: state.admin.users.orderBy,
    isFetching: state.admin.users.__isFetching,
    selected: state.admin.users.selected,
});
