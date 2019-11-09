const mock_requests = require('../../../._mocks-copy/requests.json');

const INITIAL_STATE = {
    list: mock_requests,
    filter: undefined,
    orderBy: undefined,
    error: undefined,
    __isFetching: false
};

/** debug code */
// INITIAL_STATE.selected = {
//     "issuedBy": "HLVph2RSfXXOGok4yDn1",
//     "textarea": "Шалом! Планирую лететь 27.01.2020 . Еду одна. Денег с собой практически нет. Зато в руках профессия - мастер татуажа, тату. Могу работать мастером по шугарингу и восковой депиляции. Для репатриации выбрала Иерусалим. Если кто-то чем-то сможет помочь - буду рада. Модет можно предварительно найти место работы? Скромную квартиру на съем? Хороший ульпан? Шаббат Шалом!",
//     "createdAt": 1573203085696,
//     "phone": "+380 (93) 445-53-59",
//     "name": "Яна",
//     "chats": [
//         "KaVGXf0f2uTvHavMlmcS"
//     ],
//     "email": "aleksandrit76@i.ua",
//     "_id": "K0pWLb6UWuCsfg7qWyPb",
//     "_createTime": "2019-11-08T08:51:25.724Z",
//     "_updateTime": "2019-11-08T08:51:25.724Z",
//     "_readTime": "2019-11-08T08:53:21.027Z"
// };

export const types = {
    FETCH: 'admin-requests-FETCH',
    FETCH_SUCCESS: 'admin-requests-FETCH_SUCCESS',
    FETCH_ERROR: 'admin-requests-FETCH_ERROR',
    SET_FILTER: 'admin-requests-SET_FILTER',
    SET_ORDERBY: 'admin-requests-SET_ORDERBY',
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {

        case types.FETCH: {
            console.log('## ', types.FETCH);
            return { ...state, __isFetching: true, };
        }

        case types.FETCH_SUCCESS: {
            console.log('## ', types.FETCH_SUCCESS);
            return { ...state, __isFetching: false, list: payload };
            // return { ...state, __isFetching: false, list: [...payload,...payload,...payload,...payload,...payload,...payload,...payload,...payload,...payload,...payload,] };
        }

        case types.FETCH_ERROR: {
            console.log('## ', types.FETCH_ERROR);
            return { ...state, __isFetching: false, error: payload };
        }

        case types.SET_FILTER: {
            console.log('## ', types.SET_FILTER, payload);
            return { ...state, filter: payload };
        }

        case types.SET_ORDERBY: {
            console.log('## ', types.SET_ORDERBY, payload);
            return { ...state, orderBy: payload };
        }

    }
    return state;
}


export const actions = dispatch => ({
    fetch: () => dispatch({ type: types.FETCH }),
});


export const selectors = state => ({
    requests: state.admin.requests.list,
    filter: state.admin.requests.filter,
    orderBy: state.admin.requests.orderBy,
    isFetching: state.admin.requests.__isFetching,
});
