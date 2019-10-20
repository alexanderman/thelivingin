
const INITIAL_STATE = {
    issuedByUser: undefined, /* full user object */
    createdAt: undefined, /* Date */
    requestText: undefined, /* users initial request text */
    id: undefined,
};

export const types = {
    'SEND_MESSAGE': 'SEND_MESSAGE',
    'RECEIVE_MESSAGE': 'RECEIVE_MESSAGE'
}

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
    
    }
    
    return state;
}


export const actions = {

};
