const initialState = {
    token: null,
    userRole: null,
    userDetails: {},
};

const authReducers = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return {
                ...state,
                token: action.token,
                userRole: action.userRole,
                userDetails: action.userDetails,
            };
        case 'USER_REMOVE':
            return {
                token: null,
                userRole: null,
                userDetails: {}
            };
        default:
            return state;
    }
};

export default authReducers;
