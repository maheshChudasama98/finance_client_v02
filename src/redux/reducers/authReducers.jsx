const initialState = {
    token: null,
    userDetails: {},
    permissionList: [],
};

const authReducers = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return {
                ...state,
                token: action?.token,
            };
        case 'USER_DETAILS':
            return {
                ...state,
                userDetails: action?.UserDetails
            };
        case 'USER_PERMISSION':
            return {
                ...state,
                permissionList: action?.PermissionList
            };
        default:
            return state;
    }
};

export default authReducers;
