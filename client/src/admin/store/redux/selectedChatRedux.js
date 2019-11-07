const INITIAL_STATE = {
    chat: undefined,
    error: undefined,
    __isFetching: false
};

export const types = {
    FETCH: 'selected-chat-FETCH',
    FETCH_SUCCESS: 'selected-chat-FETCH_SUCCESS',
    FETCH_ERROR: 'selected-chat-FETCH_ERROR',
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.FETCH: {
            console.log('## ', types.FETCH);
            return { ...state, __isFetching: true, };
        }

        case types.FETCH_SUCCESS: {
            console.log('## ', types.FETCH_SUCCESS, payload);
            return { ...state, __isFetching: false, chat: payload };
        }

        case types.FETCH_ERROR: {
            console.log('## ', types.FETCH_ERROR, payload);
            return { ...state, __isFetching: false, error: payload };
        }

    }
    return state;
}


export const actions = dispatch => ({
    fetch: () => dispatch({ type: types.FETCH }),
});


export const selectors = state => ({
    chat: state.admin.selectedChat.list,
    error: state.admin.selectedChat.filter,
    isFetching: state.admin.selectedChat.__isFetching,
});
/**
 * TODO: 
 *  - prepare rout to fetch chatS by requestId
 */