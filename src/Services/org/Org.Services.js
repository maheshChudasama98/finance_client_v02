import jwtAuthAxios, { errorHandler } from "../auth/jwtAuth";

export function OrgModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/org/modify', payload , {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
                if (cb) cb(res.data)
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function OrgListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/org/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function OrgRemoveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.delete(`/org/remove?OrgId=${payload}`).then((res) => {
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

export function OrgActiveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`/org/active?OrgId=${payload}`).then((res) => {
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

export function BranchModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/branch/modify', payload,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
                if (cb) cb(res.data)
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function BranchListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/branch/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function BranchRemoveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.delete(`/branch/remove?BranchId=${payload}`).then((res) => {
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

export function BranchActiveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`/branch/active?BranchId=${payload}`).then((res) => {
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

export function ModuleModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/module/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function ModuleListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/module/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function ModuleRemoveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.delete(`/module/remove?ModulesId=${payload}`).then((res) => {
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

export function ModuleActiveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`/module/active?ModulesId=${payload}`).then((res) => {
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

export function RoleModifyService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/role/modify', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
                } else {
                     if (cb) cb(res.data)
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function RoleListService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post('/role/list', payload).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                if (cb) cb(res.data)
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            };
        }).catch((error) => {
            errorHandler(error, dispatch);
        });
    };
};

export function RoleRemoveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.delete(`/role/remove?RoleId=${payload}`).then((res) => {
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

export function RoleActiveService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`/role/active?RoleId=${payload}`).then((res) => {
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


export function PermissionController(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`/permission/list?RoleId=${payload}`).then((res) => {
            if (res.data.status) {
                dispatch({ type: "FETCH_SUCCESS" });
                // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
                if (cb) cb(res.data);
            } else {
                dispatch({ type: "FETCH_ERROR", payload: res.data.message });
            }
        }).catch((error) => {
            errorHandler(error, dispatch);
        })
    }
};  

export function PermissionModifyController(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.post(`/permission/modify`,payload).then((res) => {
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

export function UserInfoAccessService(payload, cb) {
    return (dispatch) => {
        dispatch({ type: "FETCH_START" });
        jwtAuthAxios.defaults.headers.common.Authorization = localStorage.getItem('token');
        jwtAuthAxios.get(`/role/active?RoleId=${payload}`).then((res) => {
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