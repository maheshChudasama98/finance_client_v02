export const fetchSuccess = (data) => dispatch => {
  dispatch({
    type: "USER_LOGIN",
    payload: data,
  });
};

export const fetchRemove = () => dispatch => {
  dispatch({
    type: "USER_REMOVE",
  });
};