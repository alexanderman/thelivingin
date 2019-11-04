const INITIAL_STATE = {
    __isFetching: false,
    token: undefined
};

export const types = {
    INIT_TOKEN: 'INIT_ADMIN_TOKEN',
};


export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.INIT_TOKEN: {
            console.log('## ', types.INIT_TOKEN);
            return { ...state, token: payload };
        }

    }
    return state;
}


export const actions = {

};


export const selectors = state => ({
    token: state.admin.adminUser.token,
});
