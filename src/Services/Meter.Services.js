import jwtAuthAxios, { errorHandler } from "./auth/jwtAuth";

// -------------------------------- new 


export function AccountsFetchListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('accounts/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res?.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function AccountModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('account/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function AccountActionService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('account/action', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function SelectedAccountService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post(`account/selected`,payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function LabelsFetchListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('labels/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res?.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function LabelModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('label/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function LabelActionService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('label/action', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function PartiesFetchListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('parties/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res?.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function PartyModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('party/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function PartyActionService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('party/action', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function CategoriesFetchListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('categories/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res?.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function CategoryModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('category/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function CategoryActionService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('category/action', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function SubCategoriesFetchListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('sub/categories/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res?.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function LongsModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('loan/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function LongsActionService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('loan/action', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};


export function LongsFetchListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('loans/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res?.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function SubCategoryModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('sub/category/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};

export function SubCategoryActionService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.post('sub/category/action', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};