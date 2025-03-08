const initialState = {
    nav: null,
};

const authReducers = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_NAV':
            return {
                ...state,
                nav: action.payload,
            };
        default:
            return state;
    }
};

export default authReducers;
