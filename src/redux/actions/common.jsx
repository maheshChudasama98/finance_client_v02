export const fetchSuccess = (message) => (dispatch) => {
  dispatch({
    type: 'FETCH_SUCCESS',
    payload: message || '',
  });
};

export const fetchError = (error) => (dispatch) => {
  dispatch({
    type: 'FETCH_ERROR',
    payload: error,
  });
};

export const fetchStart = () => (dispatch) => {
  dispatch({
    type: 'FETCH_START',
  });
};

export const fetchSidebar = (data) => (dispatch) => {
  dispatch({
    type: 'FETCH_SIDEBAR',
    payload: data,
  });
};

export const showMessage = (message) => (dispatch) => {
  dispatch({
    type: 'SHOW_MESSAGE',
    payload: message,
  });
};

export const amountVisibilitySet = (value) => (dispatch) => {
  dispatch({
    type: 'AMOUNT_VISIBILITY_CHANGE',
    payload: value,
  });
};

export const toggleAmountVisibility = () => (dispatch) => {
  dispatch({
    type: 'TOGGLE_AMOUNT_VISIBILITY',
  });
};

export const toggleDisplayFlag = () => (dispatch) => {
  dispatch({
    type: 'TOGGLE_DISPLAY_FLAG',
  });
};

export const setDisplayFlag = (value) => (dispatch) => {
  dispatch({
    type: 'SET_DISPLAY_FLAG',
    payload: value,
  });
};
