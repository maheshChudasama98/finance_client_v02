import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { sweetAlerts } from 'src/utils/sweet-alerts';

import { SettingGetService } from 'src/Services/User.Services';

import { palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';

// ----------------------------------------------------------------------

const ThemeSettingsContext = createContext({
  mode: 'light',
  primaryColor: undefined,
  setMode: () => {},
  toggleMode: () => {},
  setPrimaryColor: () => {},
});

export function useThemeSettings() {
  return useContext(ThemeSettingsContext);
}

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  // const { token } = useSelector((state) => state.auth);
  const { error, message } = useSelector((state) => state.common);

  const token = localStorage.getItem('token');

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

  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const [primaryColor, setPrimaryColorState] = useState(
    () => localStorage.getItem('themePrimary') || ''
  );

  // Hydrate theme from server settings if localStorage is empty
  useEffect(() => {
    const hasLocal = localStorage.getItem('themeMode') || localStorage.getItem('themePrimary');

    if (token && !hasLocal) {
      dispatch(
        SettingGetService((res) => {
          if (res?.status && res?.data) {
            if (res?.data?.ThemeMode) {
              setMode(res.data.ThemeMode);
              localStorage.setItem('themeMode', res.data.ThemeMode);
            }
            if (typeof res?.data?.ThemePrimary !== 'undefined') {
              const color = res?.data?.ThemePrimary || '';
              setPrimaryColorState(color);
              if (color) localStorage.setItem('themePrimary', color);
            }
          }
        })
      );
    }
  }, [dispatch, token]);

  // Reflect mode on the <html> element for CSS hooks
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme-mode', mode);
    }
  }, [mode]);

  const setPrimaryColor = useCallback((color) => {
    setPrimaryColorState(color || '');
    if (color) {
      localStorage.setItem('themePrimary', color);
    } else {
      localStorage.removeItem('themePrimary');
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  }, []);

  const handleSetMode = useCallback((nextMode) => {
    setMode(nextMode);
    localStorage.setItem('themeMode', nextMode);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      palette: palette(mode, primaryColor || undefined),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    [mode, primaryColor]
  );
  const theme = createTheme(memoizedValue);

  theme.components = overrides(theme);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'FETCH_START' });
    }, 2200);
  }, [message, error]);

  const contextValue = useMemo(
    () => ({
      mode,
      primaryColor: primaryColor || undefined,
      setMode: handleSetMode,
      toggleMode,
      setPrimaryColor,
    }),
    [mode, primaryColor, handleSetMode, toggleMode, setPrimaryColor]
  );

  return (
    <ThemeSettingsContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <Box>
          {error ? sweetAlerts('error', error) : ''}
          {message ? sweetAlerts('success', message) : ''}
        </Box>

        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
