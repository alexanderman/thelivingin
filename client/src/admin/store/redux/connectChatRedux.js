const mock_users = require('../../../._mocks-copy/users.json');

const NOTIFICATION_ON_STATE = {
    email: {
        templateId: 'user_added_to_chat'
    },
    sms: {
        templateId: 'user_added_to_chat'
    },
}

const NOTIFICATION_OFF_STATE = {
    email: undefined,
    sms: undefined
}

const INITIAL_STATE = {
    user: undefined,
    request: undefined,
    chat: undefined,
    error: undefined, /** connect error */
    notification: {
        email: true,
        application: true,
    },
    __sendingConnect: false,
    __sendingNotification: false,
    notificationError: undefined,
};


export const types = {
    SET_USER: 'admin-connect-chat-user-SET_USER',

    SET_REQUEST: 'admin-connect-chat-user-SET_REQUEST',
    SET_CHAT: 'admin-connect-chat-user-SET_CHAT',
    TOGGLE_NOTIFICATION: 'admin-connect-chat-user-TOGGLE_NOTIFICATION',    
    /** to set defaults for each action */
    SET_NOTIFICATIONS_ON: 'admin-connect-chat-user-SET_NOTIFICATIONS_ON',    
    SET_NOTIFICATIONS_OFF: 'admin-connect-chat-user-SET_NOTIFICATIONS_OFF',    

    SEND_CONNECT: 'admin-connect-chat-user-SEND_CONNECT',
    SEND_CONNECT_SUCCESS: 'admin-connect-chat-user-SEND_CONNECT_SUCCESS',
    SEND_CONNECT_ERROR: 'admin-connect-chat-user-SEND_CONNECT_ERROR',

    SEND_DICSONNECT: 'admin-connect-chat-user-SEND_DICSONNECT',
    SEND_DICSONNECT_SUCCESS: 'admin-connect-chat-user-SEND_DICSONNECT_SUCCESS',
    SEND_DICSONNECT_ERROR: 'admin-connect-chat-user-SEND_DICSONNECT_ERROR',

    SEND_NOTIFICATION: 'admin-connect-chat-user-SEND_NOTIFICATION',
    SEND_NOTIFICATION_SUCCESS: 'admin-connect-chat-user-SEND_NOTIFICATION_SUCCESS',
    SEND_NOTIFICATION_ERROR: 'admin-connect-chat-user-SEND_NOTIFICATION_ERROR',
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.SET_USER: {
            console.log('## ', types.SET_USER, payload);
            return { ...state, user: payload, error: undefined };
        }

        case types.SET_CHAT: {
            console.log('## ', types.SET_CHAT, payload);
            return { ...state, chat: payload, error: undefined };
        }

        case types.SET_REQUEST: {
            console.log('## ', types.SET_REQUEST, payload);
            return { ...state, request: payload, error: undefined };
        }

        case types.TOGGLE_NOTIFICATION: {
            console.log('## ', types.TOGGLE_NOTIFICATION, payload);
            const { key, isOn } = payload;
            return { ...state, notification: 
                { ...state.notification, 
                    [key]: isOn 
                        ? NOTIFICATION_ON_STATE[key] 
                        : NOTIFICATION_OFF_STATE[key]
                } 
            };
        }

        case types.SET_NOTIFICATIONS_ON: {
            console.log('## ', types.SET_NOTIFICATIONS_ON, payload);
            return { ...state, notification: { ...NOTIFICATION_ON_STATE } };
        }

        case types.SET_NOTIFICATIONS_OFF: {
            console.log('## ', types.SET_NOTIFICATIONS_OFF, payload);
            return { ...state, notification: { ...NOTIFICATION_OFF_STATE } };
        }

        case types.SEND_CONNECT: {
            console.log('## ', types.SEND_CONNECT, payload);
            return { ...state, __sendingConnect: true, error: undefined };
        }

        case types.SEND_CONNECT_SUCCESS: { /** does nothing */
            console.log('## ', types.SEND_CONNECT_SUCCESS, payload);
            return { ...state, __sendingConnect: false };
        }

        case types.SEND_CONNECT_ERROR: {
            console.log('## ', types.SEND_CONNECT_ERROR, payload);
            return { ...state, __sendingConnect: false, error: payload };
        }

        case types.SEND_DICSONNECT: {
            console.log('## ', types.SEND_DICSONNECT, payload);
            return { ...state, __sendingConnect: true, error: undefined };
        }

        case types.SEND_DICSONNECT_SUCCESS: {
            console.log('## ', types.SEND_DICSONNECT_SUCCESS, payload);
            return { ...state, __sendingConnect: false };
        }

        case types.SEND_DICSONNECT_ERROR: {
            console.log('## ', types.SEND_DICSONNECT_ERROR, payload);
            return { ...state, __sendingConnect: false, error: payload };
        }

        case types.SEND_NOTIFICATION: {
            console.log('## ', types.SEND_NOTIFICATION, payload);
            return { ...state, __sendingNotification: true, notificationError: undefined };
        }

        case types.SEND_NOTIFICATION_SUCCESS: {
            console.log('## ', types.SEND_NOTIFICATION_SUCCESS, payload);
            return { ...state, __sendingNotification: false, notificationError: undefined };
        }

        case types.SEND_NOTIFICATION_ERROR: {
            console.log('## ', types.SEND_NOTIFICATION_ERROR, payload);
            return { ...state, __sendingNotification: false, notificationError: undefined };
        }

        

    }
    return state;
}


export const actions = dispatch => ({
    setUser: user => dispatch({ type: types.SET_USER, payload: user }),
    setRequest: request => dispatch({ type: types.SET_REQUEST, payload: request }),
    setChat: chat => dispatch({ type: types.SET_CHAT, payload: chat }),
    
    toggleNotification: (key, isOn) => dispatch({ type: types.TOGGLE_NOTIFICATION, payload: { key, isOn } }),
    setNotificationsON: payload => dispatch({ type: types.SET_NOTIFICATIONS_ON, payload }),
    setNotificationsOFF: payload => dispatch({ type: types.SET_NOTIFICATIONS_OFF, payload }),
    
    sendConnect: payload => dispatch({ type: types.SEND_CONNECT, payload }),
    sendDisconnect: payload => dispatch({ type: types.SEND_DICSONNECT, payload }),

    sendNotification: payload => dispatch({ type: types.SEND_NOTIFICATION, payload }),
});

function getSelectedChatMembers(selectedChat) {
    if (selectedChat && selectedChat.twilio && selectedChat.twilio.members) {
        return selectedChat.twilio.members; /** map of userId to twilio memberId  */
    }
    return {};
}

export const selectors = state => ({
    state: state.admin.connectChat, 
    user: state.admin.connectChat.user,
    chat: state.admin.connectChat.chat,
    chatMembers: getSelectedChatMembers(state.admin.connectChat.chat),
    request: state.admin.connectChat.request,
    sendingConnect: state.admin.connectChat.__sendingConnect,
    sendingNotification: state.admin.connectChat.__sendingNotification,
    inProcess: state.admin.connectChat.__sendingConnect || state.admin.connectChat.__sendingNotification,
    notification: state.admin.connectChat.notification,
    isAllSet: !!(state.admin.connectChat.user && state.admin.connectChat.chat && state.admin.connectChat.request),
    errors: state.admin.connectChat.error,
    notificationError: state.admin.connectChat.notificationError,
});
