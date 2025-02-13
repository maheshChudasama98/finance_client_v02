import { thunk } from 'redux-thunk';
import { compose, createStore, applyMiddleware } from 'redux';

import rootReducer from 'src/redux/reducers/index';

const middleware = applyMiddleware(thunk);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(middleware));

export { store };
