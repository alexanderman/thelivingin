const mock_chats = require('../../../._mocks-copy/chats.json');

/** holds chats of selected request */
const INITIAL_STATE = {
    list: [],
    error: undefined,
    __isFetching: false,
};

export const types = {
    FETCH: 'admin-selected-chat-FETCH',
    FETCH_CANCEL: 'admin-selected-chat-FETCH_CANCEL',
    FETCH_SUCCESS: 'admin-selected-chat-FETCH_SUCCESS',
    FETCH_ERROR: 'admin-selected-chat-FETCH_ERROR',
    UPDATE_CHAT: 'admin-selected-chat-UPDATE_CHAT',
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
            /** for now single chat per request -> setting selected automatically */
            return { ...state, __isFetching: false, list: payload, error: undefined };
        }

        case types.FETCH_ERROR: {
            console.log('## ', types.FETCH_ERROR, payload);
            return { ...state, __isFetching: false, error: payload, list: undefined };
        }

        case types.FETCH_CANCEL: {
            console.log('## ', types.FETCH_CANCEL);
            return { ...state, __isFetching: false, list: undefined };
        }

        case types.UPDATE_CHAT: {
            console.log('## ', types.UPDATE_CHAT, payload);
            const newList = state.list.map(chat => chat._id === payload._id ? payload : chat);
            return { ...state, list: newList };
        }

    }
    return state;
}


export const actions = dispatch => ({
    fetch: requestId => dispatch({ type: types.FETCH, payload: requestId }),
    updateChat: chat => dispatch({ type: types.UPDATE_CHAT, payload: chat }),
});

export const selectors = state => ({
    chats: state.admin.requestChatsRedux.list,
    error: state.admin.requestChatsRedux.error,
    isFetching: state.admin.requestChatsRedux.__isFetching,
});
