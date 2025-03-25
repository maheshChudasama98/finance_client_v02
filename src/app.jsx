/* eslint-disable perfectionist/sort-imports */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'src/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// import { useRouter } from 'src/routes/hooks';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { useNavigate } from 'react-router-dom';
import { InfoApiActionService } from './Services/Auth.Services';

// ----------------------------------------------------------------------

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { permissionList } = useSelector((state) => state?.auth);
  const tokenLocalStorage = localStorage.getItem('token');

  useEffect(() => {
    if (!tokenLocalStorage) {
      navigate('/login'); 
    } else {
      dispatch(
        InfoApiActionService((res) => {
          if (res.status) {
            navigate('/dashboard');
            
          } else {
            navigate('/login');
          }
        })
      );
    }
  }, []);

  useScrollToTop();
  return (
    <ThemeProvider>
      <Router permissionList={permissionList} />
    </ThemeProvider>
  );
}
