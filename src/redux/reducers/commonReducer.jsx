const INIT_STATE = {
    initialURL: '/',
    error: '',
    message: '',
    loading: false,
    isSearchBarOpen: false,
    isDataUpdate: true,
    isAmountVisible: true,
    displayFlag: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case "FETCH_START": {
            return { ...state, error: '', message: '', loading: true };
        }
        case "FETCH_SUCCESS": {
            return { ...state, error: '', loading: false };
        }
        case "SHOW_MESSAGE": {
            return { ...state, error: '', message: action.payload };
        }
        case "FETCH_ERROR": {
            return { ...state, loading: false, message: '', error: action.payload };
        }
        case "FETCH_SIDEBAR": {
            return { ...state, error: '', message: '', loading: false, isSearchBarOpen: action.payload };
        }
        case "IS_DATA_UPDATE": {
            return { ...state, isDataUpdate: !state.isDataUpdate };
        }
        case "TOGGLE_AMOUNT_VISIBILITY": {
            return { ...state, isAmountVisible: !state.isAmountVisible };
        }
        case "TOGGLE_DISPLAY_FLAG": {
            return { ...state, displayFlag: !state.displayFlag };
        }
        case "SET_DISPLAY_FLAG": {
            return { ...state, displayFlag: action.payload };
        }
        default:
            return state;
    }
};
