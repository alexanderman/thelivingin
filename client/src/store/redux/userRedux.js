
const INITIAL_STATE = {
    name: undefined,
    email: undefined,
    phone: undefined,
    id: undefined,
    error: undefined,

    _inprocess: false
};

export const types = {
    'auth_request': 'auth_request',
    'auth_success': 'auth_success',
    'auth_error': 'auth_error',
};

export default reducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'auth_request': 
            /** handle action in middleware to get user from server */
            return { ...state, _inprocess: true };
        case 'auth_success': 
            return { ...state, ...payload, _inprocess: false };
        case 'auth_error': 
            return { ...state, error: payload, _inprocess: false };
    }
    return state;
}


export const actions = {
    authRequest: payload => ({ type: 'auth_request', payload }),
    authSuccess: payload => ({ type: 'auth_success', payload }),
    authError: payload => ({ type: 'auth_error', payload }),
};
