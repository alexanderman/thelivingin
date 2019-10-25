const INITIAL_STATE = {
    __isFetching: true
};

export const types = {
    INIT_USER: 'INIT_USER'
};


export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.INIT_USER: {
            console.log('## ', types.INIT_USER);
            return { ...state, __isFetching: false, ...payload }
        }

    }
    return state;
}


export const actions = {
    initUser: user => ({ type: types.INIT_USER, payload: user }),
};


export const selectors = {
    name: state => state.user.name,
    email: state => state.user.email,
    phone: state => state.user.phone
};