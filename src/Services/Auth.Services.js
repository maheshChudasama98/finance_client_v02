import jwtAuthAxios, { errorHandler } from "./auth/jwtAuth"

export function LoginApiAction(data, cb) {

    return (dispatch) => {
        dispatch({ type: "FETCH_START" });

        jwtAuthAxios.post('/login', data).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res?.data?.message });

                localStorage.setItem("token", res?.data?.data);

                dispatch({
                    type: "USER_LOGIN",
                    token: res?.data?.data
                });

                if (cb) cb(res.data.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res?.data?.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch)
        })
    }
};

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
};

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
};

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
};

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
};


export function InfoApiActionService(cb) {

    return (dispatch) => {
        dispatch({ type: "FETCH_START" });

        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');

        jwtAuthAxios.get('/user/info').then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });

                dispatch({
                    type: "ORGS_LIST",
                    OrgsList: res?.data?.data?.Org || {}
                });

                dispatch({
                    type: "BRANCHES_LIST",
                    BranchesList: res?.data?.data?.Branch || {}
                });

                dispatch({
                    type: "USER_DETAILS",
                    UserDetails: res?.data?.data?.UserInfo || {}
                });

                dispatch({
                    type: "USER_PERMISSION",
                    PermissionList: res?.data?.data?.PermissionList || []
                });

                if (cb) cb(res.data)
                } else {
                if (cb) cb(res.data)    
                dispatch({ type: "FETCH_ERROR", payload: res?.data?.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch)
        })
    }
};