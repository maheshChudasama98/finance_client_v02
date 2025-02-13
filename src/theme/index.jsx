import PropTypes from 'prop-types';
import { useMemo, useEffect, } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { sweetAlerts } from 'src/utils/sweet-alerts';

import { palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';


// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {

  const dispatch = useDispatch();
  // const { token } = useSelector((state) => state.auth);
  const { error, message, } = useSelector((state) => state.common);


  // const tokenLocal = localStorage.getItem("token");
  // // const user = localStorage.getItem("userDetails");

  // useEffect(() => {

  //   if (token === null ) {
  //     dispatch({
  //       type: "USER_LOGIN",
  //       token: tokenLocal,
  //       userDetails: JSON.parse(localStorage.getItem("userDetails")),
  //       userRole: localStorage.getItem("userRole"),
  //     });
  //   }
  // }, [token])


  const memoizedValue = useMemo(
    () => ({
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );
  const theme = createTheme(memoizedValue);

  theme.components = overrides(theme);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "FETCH_START" });
    }, 2200);
  }, [message, error]);

  return (
    <MUIThemeProvider theme={theme}>
      <Box>
        {error ? sweetAlerts('error', error,) : ''}
        {message ? sweetAlerts('success', message) : ''}
      </Box>

      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
