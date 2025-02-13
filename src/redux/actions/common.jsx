export const fetchSuccess = (message) => dispatch => {
  dispatch({
    type: "FETCH_SUCCESS",
    payload: message || '',
  });
};

export const fetchError = (error) => dispatch => {
  dispatch({
    type: "FETCH_ERROR",
    payload: error,
  });
};

export const fetchStart = () => (dispatch) => {
  dispatch({
    type: "FETCH_START",
  });
};

export const fetchSidebar = (data) => dispatch => {
  dispatch({
    type: "FETCH_SIDEBAR",
    payload: data,
  });
};

export const showMessage = message => dispatch => {
  dispatch({
    type: "SHOW_MESSAGE",
    payload: message,
  });
};