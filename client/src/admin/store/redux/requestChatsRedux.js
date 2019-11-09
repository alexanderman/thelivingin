/** holds chats of selected request */
const INITIAL_STATE = {
    list: undefined,
    selected: undefined,
    error: undefined,
    __isFetching: false,
};

export const types = {
    FETCH: 'admin-selected-chat-FETCH',
    FETCH_CANCEL: 'admin-selected-chat-FETCH_CANCEL',
    FETCH_SUCCESS: 'admin-selected-chat-FETCH_SUCCESS',
    FETCH_ERROR: 'admin-selected-chat-FETCH_ERROR',
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
            return { ...state, __isFetching: false, chat: payload, selected: payload[0], error: undefined };
        }

        case types.FETCH_ERROR: {
            console.log('## ', types.FETCH_ERROR, payload);
            return { ...state, __isFetching: false, error: payload, list: undefined, selected: undefined };
        }

        case types.FETCH_CANCEL: {
            console.log('## ', types.FETCH_CANCEL);
            return { ...state, __isFetching: false, list: undefined, selected: undefined };
        }

    }
    return state;
}


export const actions = dispatch => ({
    fetch: requestId => dispatch({ type: types.FETCH, payload: requestId }),
});

function getSelectedChatMembers(selectedChat) {
    if (selectedChat && selectedChat.twilio && selectedChat.twilio.members) {
        return selectedChat.twilio.members; /** map of userId to twilio memberId  */
    }
    return undefined;
}

export const selectors = state => ({
    chats: state.admin.requestChatsRedux.list,
    selected: state.admin.requestChatsRedux.selected,
    selectedMembers: getSelectedChatMembers(state.admin.requestChatsRedux.selected),
    error: state.admin.requestChatsRedux.error,
    isFetching: state.admin.requestChatsRedux.__isFetching,
});
