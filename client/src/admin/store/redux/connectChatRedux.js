const mock_users = require('../../../._mocks-copy/users.json');

const INITIAL_STATE = {
    user: undefined,
};

export const types = {
    SET_USER: 'admin-connect-chat-user-SET_USER',
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.SET_USER: {
            console.log('## ', types.SET_USER, payload);
            return { ...state, user: payload };
        }

    }
    return state;
}


export const actions = dispatch => ({
    setUser: user => dispatch({ type: types.SET_USER, payload: user }),
});


export const selectors = state => ({
    user: state.admin.connectChat.user,
});
