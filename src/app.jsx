/* eslint-disable perfectionist/sort-imports */
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import 'src/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';


// ----------------------------------------------------------------------

export default function App() {
  const { token, userRole } = useSelector(state => state?.auth);
  const ReduxUserRole = localStorage.getItem("userRole");
  const dispatch = useDispatch();

  const localToken = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("userDetails"));
  const localUserRole = localStorage.getItem("userRole");

  useEffect(() => {

    if (token == null && localUser && localToken && localUserRole) {
      dispatch({
        type: "USER_LOGIN",
        token: localToken,
        userDetails: localUser,
        userRole: Number(ReduxUserRole),
      })
    }
  }, [userRole])

  useScrollToTop();
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
