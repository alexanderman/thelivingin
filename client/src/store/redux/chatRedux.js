
const INITIAL_STATE = {
    _inprocess: false, 
    _isInitiatingChannel: false
};

export const types = {
    FETCH_CHAT: 'FETCH_CHAT',
    FETCH_CHAT_SUCCESS: 'FETCH_CHAT_SUCCESS',
    FETCH_CHAT_ERROR: 'FETCH_CHAT_ERROR',

    INIT_CHANNEL: 'INIT_CHANNEL',
    INIT_CHANNEL_SUCCESS: 'INIT_CHANNEL_SUCCESS',
    INIT_CHANNEL_ERROR: 'INIT_CHANNEL_ERROR',
    
    
    // SEND_MESSAGE: 'SEND_MESSAGE',
    // RECEIVE_MESSAGE: 'RECEIVE_MESSAGE'
}

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        
        case types.FETCH_CHAT_SUCCESS: {
            console.log('## ', types.FETCH_CHAT_SUCCESS);
            const { request, chat, twilioToken } = payload;
            const { twilio: { sid } } = chat;
            const { textarea } = request;
            return { ...state, _inprocess: false, twilioToken, [sid]: { ...chat, request: textarea } };
        }

        case types.FETCH_CHAT_ERROR: {
            console.log('## ', types.FETCH_CHAT_ERROR);
            return { ...state, _inprocess: false, error: payload };
        }

        case types.FETCH_CHAT: {
            console.log('## ', types.FETCH_CHAT);
            return { ...state, _inprocess: true };
        }

        case types.INIT_CHANNEL: {
            console.log('## ', types.INIT_CHANNEL);
            return { ...state, _isInitiatingChannel: true };
        }

        case types.INIT_CHANNEL_SUCCESS: {
            console.log('## ', types.INIT_CHANNEL_SUCCESS);
            return { ...state, _isInitiatingChannel: false };
        }

        case types.INIT_CHANNEL_ERROR: {
            console.log('## ', types.INIT_CHANNEL_ERROR);
            return { ...state, _isInitiatingChannel: false };
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
