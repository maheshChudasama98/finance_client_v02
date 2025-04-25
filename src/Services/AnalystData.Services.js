import jwtAuthAxios, { errorHandler } from "./auth/jwtAuth";

export function FinanceYearService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('finance/year', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};


export function DataFollService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('data/foll', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function AccountService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('analyst/category', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function TopCategoriesService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('top/categories', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function TopSubCategoriesService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('top/subcategories', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};