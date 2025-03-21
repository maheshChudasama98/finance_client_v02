/* eslint-disable perfectionist/sort-imports */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import 'src/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { useRouter } from 'src/routes/hooks';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { InfoApiActionService } from './Services/Auth.Services';

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, permissionList } = useSelector((state) => state?.auth);


  useEffect(() => {
    dispatch(
      InfoApiActionService((res) => {
        router.push('/dashboard');
      })
    );
  }, [token]);

  useScrollToTop();
  return (
    <ThemeProvider>
      <Router permissionList={permissionList} />
    </ThemeProvider>
  );
}
