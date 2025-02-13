import jwtAuthAxios, { errorHandler } from "./auth/jwtAuth"

export function LoginApiAction(data, cb) {

    return (dispatch) => {
        console.log(dispatch);
        dispatch({ type: "FETCH_START" });

        jwtAuthAxios.post('/login', data).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });

                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("userDetails", JSON.stringify(res.data.data.userData));
                localStorage.setItem("userRole", res.data.data.userData.UserType_Id);

                dispatch({
                    type: "USER_LOGIN",
                    token: res.data.data.token,
                    userDetails: res.data.data.userData,
                    userRole: res.data.data.userData.UserType_Id,
                });

                if (cb) cb(res.data.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch)
        })
    }
}

export function FetchNoticeByUserService(branch, cb) {
    return (dispatch) => {

        dispatch({ type: "FETCH_START" });

        jwtAuthAxios.get(`/user/view/details?branch=${branch}`).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch)
        })
    }
}

export function ResetPasswordService(data, cb) {

    return (dispatch) => {
        dispatch({ type: "FETCH_START" });

        jwtAuthAxios.post('/reset-Password', data).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
                if (cb) cb(res.data);
            }
        }).catch((error) => {
            errorHandler(error, dispatch)
        })
    }
}

export function ForgotPasswordService(data, cb) {

    return (dispatch) => {
        dispatch({ type: "FETCH_START" });

        jwtAuthAxios.post('/forgot-Password', data).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "FETCH_ERROR", payload: res.data.message });
                if (cb) cb(res.data);
            }
        }).catch((error) => {
            errorHandler(error, dispatch)
        })
    }
}


export function OTPPasswordService(data, cb) {

    return (dispatch) => {
        dispatch({ type: "FETCH_START" });

        jwtAuthAxios.post('/reset-Password', data).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                // if (cb) cb(res.data);
            } else {
                // dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
            if (cb) cb(res.data);
        }).catch((error) => {
            errorHandler(error, dispatch)
        })
    }
}