const mock_users = require('../../../._mocks-copy/users.json');

const NOTIFICATION_TYPES = {
    chat_helper_added: 'chat_helper_added',
    chat_new_messages: 'chat_new_messages',
}

const NOTIFICATION_ON_STATE = { /** the type of nitfication is set by action send */
    email: { templateId: undefined },
    sms: { templateId: undefined },
}

const NOTIFICATION_OFF_STATE = {
    email: undefined,
    sms: undefined,
}

const INITIAL_STATE = { 
    ...NOTIFICATION_ON_STATE,
    user: undefined,
    __error: undefined,
    __inProcess: false,
};

function setNotificationsType(state, type) {
    return Object.keys(NOTIFICATION_ON_STATE).reduce((acc, key) => {
        if (state[key]) {
            acc[key] = { templateId: type };
        }
        return acc;
    }, {});
}

export const types = {
    /** to set defaults for each action */
    SET_USER: 'admin-chat-notification-SET_USER',    
    SET_NOTIFICATIONS_ON: 'admin-chat-notification-SET_NOTIFICATIONS_ON',    
    SET_NOTIFICATIONS_OFF: 'admin-chat-notification-SET_NOTIFICATIONS_OFF',    
    TOGGLE_NOTIFICATION: 'admin-chat-notification-TOGGLE_NOTIFICATION',    
    SEND_NOTIFICATION_ADD_TO_CHAT: 'admin-chat-notification-SEND_NOTIFICATION_ADD_TO_CHAT',
    SEND_NOTIFICATION_NEW_MESSAGES: 'admin-chat-notification-SEND_NOTIFICATION_NEW_MESSAGES',
    SEND_NOTIFICATION_SUCCESS: 'admin-chat-notification-SEND_NOTIFICATION_SUCCESS',
    SEND_NOTIFICATION_ERROR: 'admin-chat-notification-SEND_NOTIFICATION_ERROR',
}

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.TOGGLE_NOTIFICATION: {
            console.log('## ', types.TOGGLE_NOTIFICATION, payload);
            const { key } = payload;
            const isOn = !!state[key];
            return { 
                ...state, 
                [key]: isOn 
                    ? NOTIFICATION_OFF_STATE[key] 
                    : NOTIFICATION_ON_STATE[key]
            };
        }

        case types.SET_USER: {
            console.log('## ', types.SET_USER, payload);
            return { ...state, user: payload };
        }

        case types.SET_NOTIFICATIONS_ON: {
            console.log('## ', types.SET_NOTIFICATIONS_ON, payload);
            return { ...state, ...NOTIFICATION_ON_STATE };
        }

        case types.SET_NOTIFICATIONS_OFF: {
            console.log('## ', types.SET_NOTIFICATIONS_OFF, payload);
            return { ...state, ...NOTIFICATION_OFF_STATE };
        }

        case types.SEND_NOTIFICATION_ADD_TO_CHAT: {
            console.log('## ', types.SEND_NOTIFICATION_ADD_TO_CHAT, payload);
            return { ...state, __inProcess: true, __error: undefined, ...setNotificationsType(state, NOTIFICATION_TYPES.chat_helper_added) };
        }

        case types.SEND_NOTIFICATION_NEW_MESSAGES: {
            console.log('## ', types.SEND_NOTIFICATION_NEW_MESSAGES, payload);
            return { ...state, __inProcess: true, __error: undefined, ...setNotificationsType(state, NOTIFICATION_TYPES.chat_new_messages) };
        }

        case types.SEND_NOTIFICATION_SUCCESS: {
            console.log('## ', types.SEND_NOTIFICATION_SUCCESS, payload);
            return { ...state, __inProcess: false, __error: undefined };
        }

        case types.SEND_NOTIFICATION_ERROR: {
            console.log('## ', types.SEND_NOTIFICATION_ERROR, payload);
            return { ...state, __inProcess: false, __error: payload };
        }
    }

    return state;
}

/** returns only the portion of notifications from the state */
function getNotification(state) {
    return Object.keys(NOTIFICATION_ON_STATE).reduce((acc, key) => {
        acc[key] = state[key];
        return acc;
    }, {});
}

/** when adding an admin without notifications, popup checks if needs to send notification */
function isNotificationSet(state) {
    return !!Object.keys(getNotification(state)).filter(key => !!state[key]).length;
}

export const actions = dispatch => ({
    toggleNotification: key => dispatch({ type: types.TOGGLE_NOTIFICATION, payload: { key } }),
    setNotificationsON: payload => dispatch({ type: types.SET_NOTIFICATIONS_ON, payload }),
    setNotificationsOFF: payload => dispatch({ type: types.SET_NOTIFICATIONS_OFF, payload }),
    sendNotificationAddedToChat: payload => dispatch({ type: types.SEND_NOTIFICATION_ADD_TO_CHAT }),
    sendNotificationChatNewMessages: payload => dispatch({ type: types.SEND_NOTIFICATION_NEW_MESSAGES }),
    setUser: payload => dispatch({ type: types.SET_USER, payload }),
});

export const selectors = state => ({
    state: state.admin.chatNotifications, 
    notification: getNotification(state.admin.chatNotifications), 
    isSet: isNotificationSet(state.admin.chatNotifications),
    sms: state.admin.chatNotifications.sms, 
    email: state.admin.chatNotifications.email, 
    user: state.admin.chatNotifications.user, 
    error: state.admin.chatNotifications.__error, 
    inProcess: state.admin.chatNotifications.__inProcess, 
});
