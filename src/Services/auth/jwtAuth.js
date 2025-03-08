import { apiURL, ERROR_CODE, BAD_REQUEST_CODE, SERVER_ERROR_CODE, TOKEN_NOT_VALID_CODE, TOKEN_NOT_PROVIDED_CODE, } from "src/constance";

import jwtAxios from "axios";

const jwtAuthAxios = jwtAxios.create({
    baseURL: `${apiURL}/api/`,
    headers: {
        'Content-Type': 'application/json'
    }
});

jwtAuthAxios.interceptors.request.use(
    (config) => {
        config.headers = {
            ...config.headers
        }
        return config
    },
    (error) => Promise.reject(error)
);

jwtAuthAxios.interceptors.response.use(
    (response) => {
        if (response?.status === TOKEN_NOT_VALID_CODE || response?.status === TOKEN_NOT_PROVIDED_CODE) {
            localStorage.removeItem('token');
            window.location.replace("/login");
        }
        return Promise.resolve(response);
    },
    async (err) => {
        if (err?.response?.status === BAD_REQUEST_CODE || err?.response?.status === ERROR_CODE || err?.response?.status === SERVER_ERROR_CODE) {
            return Promise.reject(err?.response?.data);
        }

        if (err?.response?.status === TOKEN_NOT_VALID_CODE || err?.response?.status === TOKEN_NOT_PROVIDED_CODE) {
            localStorage.removeItem('token');
            window.location.replace("/login");
            return Promise.reject(err); // Ensure you return a value here
        }
        return Promise.reject(err);
    }
);

export default jwtAuthAxios;

export const setAuthToken = (token) => {
    if (token) {
        if (jwtAuthAxios.defaults.headers.common) {
            jwtAuthAxios.defaults.headers.common.Authorization = token;
        }
        sessionStorage.setItem('token', token);
    } else {
        if (jwtAuthAxios.defaults.headers.common) {
            delete jwtAuthAxios.defaults.headers.common.Authorization;
        }
        sessionStorage.removeItem('token');
    }
};


export const getAuthToken = () => sessionStorage.getItem("token");


export function errorHandler(error, dispatch) {
    if (error.response) {
        if (error.response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        dispatch({ type: "FETCH_ERROR", payload: '' });
        console.log('Error****:', error.response.data.message);
    } else {
        console.log('Error****:', error);
        dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
};

