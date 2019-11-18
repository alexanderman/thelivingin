const NOTIFICATION_TYPES = {
    chat_helper_added: 'chat_helper_added',
}

const NOTIFICATION_ON_STATE = {
    email: { templateId: NOTIFICATION_TYPES.chat_helper_added },
    sms: { templateId: NOTIFICATION_TYPES.chat_helper_added },
}

const NOTIFICATION_OFF_STATE = {
    email: undefined,
    sms: undefined
}

const INITIAL_STATE = { 
    ...NOTIFICATION_ON_STATE,
    __error: undefined,
    __inProcess: false,
};

export const types = {
    /** to set defaults for each action */
    SET_NOTIFICATIONS_ON: 'admin-chat-notification-SET_NOTIFICATIONS_ON',    
    SET_NOTIFICATIONS_OFF: 'admin-chat-notification-SET_NOTIFICATIONS_OFF',    
    TOGGLE_NOTIFICATION: 'admin-chat-notification-TOGGLE_NOTIFICATION',    
    SEND_NOTIFICATION: 'admin-chat-notification-SEND_NOTIFICATION',
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

        case types.SET_NOTIFICATIONS_ON: {
            console.log('## ', types.SET_NOTIFICATIONS_ON, payload);
            return { ...state, ...NOTIFICATION_ON_STATE };
        }

        case types.SET_NOTIFICATIONS_OFF: {
            console.log('## ', types.SET_NOTIFICATIONS_OFF, payload);
            return { ...state, ...NOTIFICATION_OFF_STATE };
        }

        case types.SEND_NOTIFICATION: {
            console.log('## ', types.SEND_NOTIFICATION, payload);
            return { ...state, __inProcess: true, __error: undefined };
        }

        case types.SEND_NOTIFICATION_SUCCESS: {
            console.log('## ', types.SEND_NOTIFICATION_SUCCESS, payload);
            return { ...state, __inProcess: false, __error: undefined };
        }

        case types.SEND_NOTIFICATION_ERROR: {
            console.log('## ', types.SEND_NOTIFICATION_ERROR, payload);
            return { ...state, __inProcess: false, __error: undefined };
        }
    }

    return state;
}


export const actions = dispatch => ({
    toggleNotification: (key, isOn) => dispatch({ type: types.TOGGLE_NOTIFICATION, payload: { key, isOn } }),
    setNotificationsON: payload => dispatch({ type: types.SET_NOTIFICATIONS_ON, payload }),
    setNotificationsOFF: payload => dispatch({ type: types.SET_NOTIFICATIONS_OFF, payload }),
    sendNotification: payload => dispatch({ type: types.SEND_NOTIFICATION, payload }),
});

export const selectors = state => ({
    state: state.admin.chatNotifications, 
    sms: state.admin.chatNotifications.sms, 
    email: state.admin.chatNotifications.email, 
    error: state.admin.chatNotifications.__error, 
    inProcess: state.admin.chatNotifications.__inProcess, 
});
