import jwtAuthAxios, { errorHandler } from "./auth/jwtAuth";

export function FetchUserListController(cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
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

export function UserModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post(`/user/modify`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                if (cb) cb(res.data);
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
}

export function DefaultBrachService(payload,cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
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

export function SettingModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post(`/setting/modify`, payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                if (cb) cb(res.data);
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
}

// Enhanced service for theme settings
export function ThemeModifyService(themeMode, themePrimary, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        const payload = {
            ThemeMode: themeMode,
            ThemePrimary: themePrimary,
            DefaultTimeFrame: localStorage.getItem('DefaultTimeFrame') || 'MONTH',
            DefaultDuration: localStorage.getItem('DefaultDuration') || 'Last_Thirty_Days',
            DefaultDateFormat: localStorage.getItem('DefaultDateFormat') || 'DD/MM/YYYY',
            DefaultCurrency: localStorage.getItem('DefaultCurrency') || 'INR',
            AmountHide: localStorage.getItem('AmountHide') === 'true' ? 1 : 0
        };

        jwtAuthAxios.post(`/setting/modify`, payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
            }
            if (cb) cb(res.data);
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
}

// Enhanced service for amount visibility settings
export function AmountVisibilityModifyService(isAmountVisible, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        const payload = {
            ThemeMode: localStorage.getItem('themeMode') || 'light',
            ThemePrimary: localStorage.getItem('themePrimary') || '#5BC43A',
            DefaultTimeFrame: localStorage.getItem('DefaultTimeFrame') || 'MONTH',
            DefaultDuration: localStorage.getItem('DefaultDuration') || 'Last_Thirty_Days',
            DefaultDateFormat: localStorage.getItem('DefaultDateFormat') || 'DD/MM/YYYY',
            DefaultCurrency: localStorage.getItem('DefaultCurrency') || 'INR',
            AmountHide: isAmountVisible ? 0 : 1
        };

        jwtAuthAxios.post(`/setting/modify`, payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
            }
            if (cb) cb(res.data);
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
}

// Enhanced service for user profile updates
export function UserProfileUpdateService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post(`/user/profile/update`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message || "Profile updated successfully" });
                if (cb) cb(res.data);
            } else {
                if (cb) cb(res.data);
                dispatch({ type: "FETCH_ERROR", payload: res.data.message || "Failed to update profile" });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
}