const INITIAL_STATE = {
    list: [],
    selected: undefined,
    filter: undefined,
    orderBy: undefined,
    error: undefined,
    __isFetching: false
};

export const types = {
    FETCH: 'admin-requests-FETCH',
    FETCH_SUCCESS: 'admin-requests-FETCH_SUCCESS',
    FETCH_ERROR: 'admin-requests-FETCH_ERROR',
    SET_FILTER: 'admin-requests-SET_FILTER',
    SET_ORDERBY: 'admin-requests-SET_ORDERBY',
    SET_SELECTED: 'admin-requests-SET_SELECTED',
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
        }

        case types.FETCH_ERROR: {
            console.log('## ', types.FETCH_ERROR);
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
            console.log('## ', types.SET_SELECTED);
            return { ...state, selected: payload };
        }

    }
    return state;
}


export const actions = dispatch => ({
    fetch: () => dispatch({ type: types.FETCH }),
    setSelected: request => dispatch({ type: types.SET_SELECTED, payload: request }),
});


export const selectors = state => ({
    requests: state.admin.requests.list,
    filter: state.admin.requests.filter,
    orderBy: state.admin.requests.orderBy,
    isFetching: state.admin.requests.__isFetching,
    selected: state.admin.requests.selected,
});
