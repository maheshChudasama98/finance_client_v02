/* eslint-disable perfectionist/sort-imports */
import { useEffect } from 'react';
import {  useSelector } from 'react-redux';
import 'src/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  // const dispatch = useDispatch();

  const { token, userRole, permissionList } = useSelector((state) => state?.auth);

  useEffect(() => {
    
    // if (token == null && localUser && localToken && localUserRole) {
    //   dispatch({
    //     type: "USER_LOGIN",
    //     token: localToken,
    //     userDetails: localUser,
    //     userRole: Number(ReduxUserRole),
    //   })
    // }
  }, [userRole, token]);

  useScrollToTop();
  return (
    <ThemeProvider>
      <Router permissionList={permissionList} />
    </ThemeProvider>
  );
}
