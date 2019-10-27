export const CHAT_STATUS = {
    UNDEFINED: 'UNDEFINED',
    FETCH: 'FETCH',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
    CONNECT: 'CONNECT',
    CONNECT_SUCCESS: 'CONNECT_SUCCESS',
    CONNECT_ERROR: 'CONNECT_ERROR',
}

const INITIAL_STATE = {
    __selectedChatId: null,
    channels: {}, /** keys db chatIds, all chats data is here */
};

export const types = {
    FETCH_CHAT: 'FETCH_CHAT',
    FETCH_CHAT_SUCCESS: 'FETCH_CHAT_SUCCESS',
    FETCH_CHAT_ERROR: 'FETCH_CHAT_ERROR',

    CONNECT_CHANNEL: 'CONNECT_CHANNEL',
    CONNECT_CHANNEL_SUCCESS: 'CONNECT_CHANNEL_SUCCESS',
    CONNECT_CHANNEL_ERROR: 'CONNECT_CHANNEL_ERROR',
    LISTEN_ERROR: 'LISTEN_ERROR',
    
    
    SEND_MESSAGE: 'SEND_MESSAGE',
    SEND_MESSAGE_ERROR: 'SEND_MESSAGE_ERROR',
    SEND_MESSAGE_SUCCESS: 'SEND_MESSAGE_SUCCESS',
    RECEIVE_MESSAGE: 'RECEIVE_MESSAGE'
}

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        
        case types.FETCH_CHAT: {
            console.log('## ', types.FETCH_CHAT);
            const { chatId } = payload;
            return { ...state, 
                __selectedChatId: chatId, // __selectedChatId is set only once while we connect to single channel
                channels: { ...state.channels, [chatId]: { __status: CHAT_STATUS.FETCH } } 
            };
        }

        case types.FETCH_CHAT_ERROR: { 
            console.log('## ', types.FETCH_CHAT_ERROR); 
            const { __selectedChatId: chatId, channels } = state;  // TODO: get from action, fix startupEpic 
            const { [chatId]: chatState } = channels;
            return { ...state, 
                channels: { ...channels, 
                    [chatId]: { ...chatState, __status: CHAT_STATUS.FETCH_ERROR, __error: payload } 
                } 
            };
        }

        case types.FETCH_CHAT_SUCCESS: {
            console.log('## ', types.FETCH_CHAT_SUCCESS);
            const { request, chat } = payload;
            const { _id: chatId } = chat;
            const { textarea } = request;
            return { ...state, 
                channels: {
                    ...state.channels,
                    [chatId]: { ...chat, 
                        request: textarea, 
                        __status: CHAT_STATUS.FETCH_SUCCESS 
                    }
                }
            };
        }

        case types.CONNECT_CHANNEL: {
            console.log('## ', types.CONNECT_CHANNEL);
            const { __selectedChatId: chatId, channels } = state;
            const { [chatId]: chatState } = channels;
            return { ...state,
                channels: {
                    ...channels,
                    [chatId]: { ...chatState, __status: CHAT_STATUS.CONNECT }
                }
            };
        }

        case types.CONNECT_CHANNEL_SUCCESS: {
            console.log('## ', types.CONNECT_CHANNEL_SUCCESS);
            const { __selectedChatId: chatId, channels } = state;
            const { [chatId]: chatState } = channels;
            return { ...state,
                channels: {
                    ...channels,
                    [chatId]: { ...chatState, __status: CHAT_STATUS.CONNECT_SUCCESS }
                }
            };
        }

        case types.CONNECT_CHANNEL_ERROR: {
            console.log('## ', types.CONNECT_CHANNEL_ERROR);
            const { __selectedChatId: chatId, channels } = state;
            const { [chatId]: chatState } = channels;
            return { ...state,
                channels: {
                    ...channels,
                    [chatId]: { ...chatState, __status: CHAT_STATUS.CONNECT_ERROR, __error: payload }
                }
            };
        }

        case types.SEND_MESSAGE: { 
            console.log('## ', types.SEND_MESSAGE);
            return state;
        }
        case types.SEND_MESSAGE_SUCCESS: {
            console.log('## ', types.SEND_MESSAGE_SUCCESS, payload);
            return state;
        }        
        case types.SEND_MESSAGE_ERROR: {
            console.log('## ', types.SEND_MESSAGE_ERROR, payload);
            return state;
        }        

        case types.RECEIVE_MESSAGE: {
            console.log('## ', types.RECEIVE_MESSAGE, payload);
            const { __selectedChatId: chatId, channels } = state;
            const { [chatId]: chatState } = channels;
            return { ...state,
                channels: {
                    ...channels,
                    [chatId]: { ...chatState, messages: [ ...(chatState.messages || []), payload ] }
                }
            };
        }

    }
    
    return state;
}


export const actions = dispatch => ({
    fetchChat: (chatId, userId, requestId, sig) => dispatch({ 
        type: types.FETCH_CHAT, 
        payload: { chatId, userId, requestId, sig } 
    }),
    sendMessage: (user, message) => dispatch({
        type: types.SEND_MESSAGE,
        payload: { user, message }
    }),
});


export const selectors = {
    request: state => { 
        const { __selectedChatId: chatId, channels } = state.chat;
        if (chatId && channels[chatId]) {
            return channels[chatId].request;
        }
        return undefined;
    },
    status: state => { 
        const { __selectedChatId: chatId, channels } = state.chat;
        if (chatId && channels[chatId]) {
            const { __status } = channels[chatId];
            return __status;
        }
        return CHAT_STATUS.UNDEFINED;
    },
    messages: state => {
        const { __selectedChatId: chatId, channels } = state.chat;
        if (chatId && channels[chatId]) {
            return channels[chatId].messages || [];
        }
        return [];
    }
};
