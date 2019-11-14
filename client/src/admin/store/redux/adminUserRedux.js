const INITIAL_STATE = {
    __isFetching: false,
    token: undefined
};

export const types = {
    SET_TOKEN: 'SET_ADMIN_TOKEN',
};


export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.SET_TOKEN: {
            console.log('## ', types.SET_TOKEN, payload);
            return { ...state, token: payload };
        }

    }
    return state;
}


export const actions = dispatch => ({
    setToken: token => dispatch({ type: types.SET_TOKEN, payload: token }),
});


export const selectors = state => ({
    token: state.admin.adminUser.token,
});
