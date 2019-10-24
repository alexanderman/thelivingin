const INITIAL_STATE = {
    name: undefined,
    email: undefined,
    phone: undefined,
    id: undefined,
    error: undefined,

    _inprocess: false
};

export const types = {
    'AUTH_REQUEST': 'AUTH_REQUEST',
    'AUTH_SUCCESS': 'AUTH_SUCCESS',
    'AUTH_ERROR': 'AUTH_ERROR',
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case types.AUTH_REQUEST: 
            /** handle action in middleware to get user from server */
            return { ...state, _inprocess: true };
        case types.AUTH_SUCCESS: 
            return { ...state, ...payload, _inprocess: false };
        case types.AUTH_ERROR: 
            return { ...state, error: payload, _inprocess: false };


        /** debug code */        
        case 'startup':
            console.log('redux startup', action);
            return state;
        
        case 'onMessage':
            console.log('redux onMessage', action);
            return state;

        case 'error': /** TODO: handle errors */
            console.log('redux error', action);
            return state;

    }
    return state;
}


export const actions = {
    authRequest: payload => ({ type: types.AUTH_REQUEST, payload }),
    authSuccess: payload => ({ type: types.AUTH_SUCCESS, payload }),
    authError: payload => ({ type: types.AUTH_ERROR, payload }),
};
