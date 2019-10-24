const INITIAL_STATE = {
    _isFetching: true
};

export const types = {
    INIT_USER: 'INIT_USER'
};


export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.INIT_USER: {
            console.log('## ', types.INIT_USER);
            return { ...state, _isFetching: false, ...payload }
        }


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
    initUser: user => ({ type: types.INIT_USER, payload: user }),
};
