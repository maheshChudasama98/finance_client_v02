import { combineReducers } from 'redux';

import authReducers from './authReducers';
import commonReducer from './commonReducer';
import masterReducers from './masterReducers';

const rootReducer = combineReducers({
    auth: authReducers,
    common: commonReducer,
    master: masterReducers,
});

export default rootReducer;
