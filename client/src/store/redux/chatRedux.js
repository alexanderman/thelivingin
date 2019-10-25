export const CHAT_STATUS = {
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
    
    
    // SEND_MESSAGE: 'SEND_MESSAGE',
    // RECEIVE_MESSAGE: 'RECEIVE_MESSAGE'
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

    }
    
    return state;
}


export const actions = {
    fetchChat: (chatId, userId, requestId, sig) => ({ 
        type: types.FETCH_CHAT, 
        payload: { chatId, userId, requestId, sig } 
    })
};


export const selectors = {
    request: state => { // TODO
        // const { chat } = state;
        // if (chat.__selectedChatId) {
        //     return chat[chat.__selectedChatId].request;
        // }
        return undefined;
    },
    // isReady: state => state._
};
