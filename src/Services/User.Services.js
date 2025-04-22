import jwtAuthAxios, { errorHandler } from "./auth/jwtAuth";

export function FetchUserListController(cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post(`/user/list`).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
}

export function UserModifyService(payload,cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post(`/user/modify`,payload,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data)
                } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
}

export function DefaultBrachService(payload,cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`user/default?BranchId=${payload}`).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data)
                } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
}

export function SettingGetService(cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`/setting`).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data)
                } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
}

export function SettingModifyService(payload,cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post(`/setting/modify`,payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data)
                } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
}