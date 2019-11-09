const mock_users = require('../../../._mocks-copy/users.json');

/** TODO: move all connect user to chat data here
 *  - user
 *  - chat
 *  - request
 */
const INITIAL_STATE = {
    user: undefined,
    request: undefined,
    chat: undefined,
    error: undefined,
    notification: {
        email: true,
        application: true,
    },
    __inProcess: false,
};

export const types = {
    SET_USER: 'admin-connect-chat-user-SET_USER',

    SET_REQUEST: 'admin-connect-chat-user-SET_REQUEST',
    SET_CHAT: 'admin-connect-chat-user-SET_CHAT',
    SET_NOTIFICATIONS: 'admin-connect-chat-user-SET_NOTIFICATIONS',    

    SEND_CONNECT: 'admin-connect-chat-user-SEND_CONNECT',
    SEND_CONNECT_SUCCESS: 'admin-connect-chat-user-SEND_CONNECT_SUCCESS',
    SEND_CONNECT_ERROR: 'admin-connect-chat-user-SEND_CONNECT_ERROR',

    SEND_DICSONNECT: 'admin-connect-chat-user-SEND_DICSONNECT',
    SEND_DICSONNECT_SUCCESS: 'admin-connect-chat-user-SEND_DICSONNECT_SUCCESS',
    SEND_DICSONNECT_ERROR: 'admin-connect-chat-user-SEND_DICSONNECT_ERROR',
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.SET_USER: {
            console.log('## ', types.SET_USER, payload);
            return { ...state, user: payload };
        }

        case types.SET_CHAT: {
            console.log('## ', types.SET_CHAT, payload);
            return { ...state, chat: payload };
        }

        case types.SET_REQUEST: {
            console.log('## ', types.SET_REQUEST, payload);
            return { ...state, request: payload };
        }

        case types.SET_NOTIFICATIONS: {
            console.log('## ', types.SET_NOTIFICATIONS, payload);
            return { ...state, notification: payload };
        }

        case types.SEND_CONNECT: {
            console.log('## ', types.SEND_CONNECT, payload);
            return { ...state, __inProcess: true };
        }

        case types.SEND_CONNECT_SUCCESS: {
            console.log('## ', types.SEND_CONNECT_SUCCESS, payload);
            return { ...state, __inProcess: false };
        }

        case types.SEND_CONNECT_ERROR: {
            console.log('## ', types.SEND_CONNECT_ERROR, payload);
            return { ...state, __inProcess: false, error: payload };
        }

        case types.SEND_DICSONNECT: {
            console.log('## ', types.SEND_DICSONNECT, payload);
            return { ...state, __inProcess: true };
        }

        case types.SEND_DICSONNECT_SUCCESS: {
            console.log('## ', types.SEND_DICSONNECT_SUCCESS, payload);
            return { ...state, __inProcess: false };
        }

        case types.SEND_DICSONNECT_ERROR: {
            console.log('## ', types.SEND_DICSONNECT_ERROR, payload);
            return { ...state, __inProcess: false, error: payload };
        }

    }
    return state;
}


export const actions = dispatch => ({
    setUser: user => dispatch({ type: types.SET_USER, payload: user }),
    setRequest: request => dispatch({ type: types.SET_REQUEST, payload: request }),
    setChat: chat => dispatch({ type: types.SET_CHAT, payload: chat }),
    setNotifications: payload => dispatch({ type: types.SET_NOTIFICATIONS, payload }),
    sendConnect: payload => dispatch({ type: types.SEND_CONNECT, payload }),
    sendDisconnect: payload => dispatch({ type: types.SEND_DICSONNECT, payload }),
});


export const selectors = state => ({
    state: state.admin.connectChat, 
    user: state.admin.connectChat.user,
    chat: state.admin.connectChat.chat,
    request: state.admin.connectChat.request,
    inProcess: state.admin.connectChat.__inProcess,
    notification: state.admin.connectChat.notification,
    isAllSet: !!(state.admin.connectChat.user && state.admin.connectChat.chat && state.admin.connectChat.request)
});
