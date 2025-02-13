import { combineReducers } from 'redux';

import authReducers from './authReducers';
import commonReducer from './commonReducer';

const rootReducer = combineReducers({
    auth: authReducers,
    common: commonReducer,
});

export default rootReducer;
