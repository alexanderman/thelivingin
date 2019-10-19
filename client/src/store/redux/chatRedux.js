
const INITIAL_STATE = {
    issuedByUser: undefined, /* full user object */
    createdAt: undefined, /* Date */
    requestText: undefined, /* users initial request text */
    id: undefined,
};

export const types = {
    'send_message': 'send_message',
    'receive_message': 'receive_message'
}

export default reducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
    
    }
    
    return state;
}


export const actions = {

};
