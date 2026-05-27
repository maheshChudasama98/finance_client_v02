import { encrypt } from 'src/utils/crypto.utils';

import { DevelopMood } from 'src/constance';

import jwtAuthAxios, { errorHandler } from './auth/jwtAuth';

export function LoginApiAction(data, cb) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_START' });

    jwtAuthAxios
      .post('/login', data)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: 'FETCH_SUCCESS' });
          // dispatch({ type: 'SHOW_MESSAGE', payload: res?.data?.message });

          localStorage.setItem('token', DevelopMood ? res?.data?.data : encrypt(res?.data?.data));

          dispatch({
            type: 'USER_LOGIN',
            token: DevelopMood ? res?.data?.data : encrypt(res?.data?.data),
          });

          if (cb) cb(res.data);
        } else {
          cb(res.data);
          // dispatch({ type: 'FETCH_ERROR', payload: res?.data?.message });
        }
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  };
}

export function SignupApiAction(data, cb) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_START' });
    jwtAuthAxios
      .post('/singup', data)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: 'FETCH_SUCCESS' });
          // dispatch({ type: 'SHOW_MESSAGE', payload: res?.data?.message });

          localStorage.setItem('token', DevelopMood ? res?.data?.data : encrypt(res?.data?.data));

          dispatch({
            type: 'USER_LOGIN',
            token: DevelopMood ? res?.data?.data : encrypt(res?.data?.data),
          });
          if (cb) cb(res.data);
        } else {
          dispatch({ type: 'FETCH_SUCCESS' });
          cb(res.data);
        }
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  };
}

export function FetchNoticeByUserService(branch, cb) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_START' });
    jwtAuthAxios
      .get(`/user/view/details?branch=${branch}`)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: 'FETCH_SUCCESS' });
          if (cb) cb(res.data.data);
        } else {
          dispatch({ type: 'FETCH_ERROR', payload: res.data.message });
        }
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  };
}

export function ResetPasswordService(data, cb) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_START' });
    jwtAuthAxios
      .post('/reset-Password', data)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: 'FETCH_SUCCESS' });
          dispatch({ type: 'SHOW_MESSAGE', payload: res.data.message });
          if (cb) cb(res.data);
        } else {
          dispatch({ type: 'FETCH_ERROR', payload: res.data.message });
          if (cb) cb(res.data);
        }
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  };
}

export function ForgotPasswordService(data, cb) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_START' });

    jwtAuthAxios
      .post('/forgot-Password', data)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: 'FETCH_SUCCESS' });
          // dispatch({ type: "SHOW_MESSAGE", payload: res.data.message });
          if (cb) cb(res.data);
        } else {
          dispatch({ type: 'FETCH_SUCCESS' });
          // dispatch({ type: "FETCH_ERROR", payload: res.data.message });
          if (cb) cb(res.data);
        }
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  };
}

export function OTPPasswordService(data, cb) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_START' });

    jwtAuthAxios
      .post('/reset-Password', data)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: 'FETCH_SUCCESS' });
          dispatch({ type: 'SHOW_MESSAGE', payload: res.data.message });
          // if (cb) cb(res.data);
        } else {
          // dispatch({ type: "FETCH_ERROR", payload: res.data.message });
        }
        if (cb) cb(res.data);
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  };
}

export function InfoApiActionService(cb) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_START' });

    jwtAuthAxios
      .get('/user/info')
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: 'FETCH_SUCCESS' });

          dispatch({ type: 'ORGS_LIST', OrgsList: res?.data?.data?.Org || {} });

          dispatch({ type: 'BRANCHES_LIST', BranchesList: res?.data?.data?.Branch || {} });

          dispatch({ type: 'USER_DETAILS', UserDetails: res?.data?.data?.UserInfo || {} });

          dispatch({
            type: 'USER_PERMISSION',
            PermissionList: res?.data?.data?.PermissionList || [],
          });

          dispatch({
            type: 'THEME_MODE_SET',
            payload: res?.data?.data?.UserInfo?.ThemeMode || 'light',
          });

          dispatch({
            type: 'THEME_PRIMARY_SET',
            payload: res?.data?.data?.UserInfo?.ThemePrimary || '#5BC43A',
          });

          dispatch({
            type: 'AMOUNT_VISIBILITY_CHANGE',
            payload: !!res?.data?.data?.UserInfo?.AmountHide,
          });

          localStorage.setItem(
            'DefaultTimeFrame',
            res?.data?.data?.UserInfo?.DefaultTimeFrame || 'MONTH'
          );

          localStorage.setItem(
            'DefaultDuration',
            res?.data?.data?.UserInfo?.DefaultDuration || 'Last_Thirty_Days'
          );

          localStorage.setItem(
            'DefaultDateFormat',
            res?.data?.data?.UserInfo?.DefaultDateFormat || 'DD/MM/YYYY'
          );

          localStorage.setItem(
            'DefaultCurrency',
            res?.data?.data?.UserInfo?.DefaultCurrency || 'INR'
          );

          localStorage.setItem('themeMode', res?.data?.data?.UserInfo?.ThemeMode || 'light');

          localStorage.setItem(
            'themePrimary',
            res?.data?.data?.UserInfo?.ThemePrimary || '#5BC43A'
          );

          localStorage.setItem('AmountHide', res?.data?.data?.UserInfo?.AmountHide);

          if (cb) cb(res.data);
        } else {
          if (cb) cb(res.data);
          dispatch({ type: 'FETCH_ERROR', payload: res?.data?.message });
        }
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  };
}
