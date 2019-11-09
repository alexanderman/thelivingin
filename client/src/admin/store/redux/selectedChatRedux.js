const INITIAL_STATE = {
    list: undefined,
    selected: undefined,
    error: undefined,
    __isFetching: false,
};

/** debug code */
// INITIAL_STATE.chat =     {
//     "issuedBy": "I4H5trugYrOIjZh2EOU9",
//     "createdAt": 1573130635706,
//     "requestId": "TTeihNaHAUl7cYgQr5G0",
//     "twilio": {
//         "sid": "CHccf5f081039543b39db2b275f00b22ef"
//     },
//     "_id": "4BbIHGl6tZUG48J2jRua",
//     "_createTime": "2019-11-08T07:04:18.701Z",
//     "_updateTime": "2019-11-08T07:04:18.701Z",
//     "_readTime": "2019-11-08T08:51:43.687Z"
// };

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


export const selectors = state => ({
    chats: state.admin.selectedChat.list,
    selected: state.admin.selectedChat.selected,
    error: state.admin.selectedChat.error,
    isFetching: state.admin.selectedChat.__isFetching,
});
