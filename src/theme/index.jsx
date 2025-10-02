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
  const themeMode = localStorage.getItem('themeMode');
  const themePrimary = localStorage.getItem('themePrimary');

  // const tokenLocal = localStorage.getItem("token");
  // const user = localStorage.getItem("userDetails");

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
  }, [dispatch, token, themeMode]);

  useEffect(() => {
    setMode(themeMode || 'light');
    setPrimaryColorState(themePrimary || "#5BC43A");
  }, [themeMode, themePrimary]);

  // Reflect mode on the <html> element for CSS hooks
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme-mode', mode);
    }
  }, [mode]);

  // Inject CSS custom properties into document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const currentPalette = palette(mode, primaryColor || undefined);
      // const currentShadows = shadows(mode);
      const currentCustomShadows = customShadows(mode, primaryColor || undefined);
      const root = document.documentElement;

      // Set palette colors as CSS custom properties
      root.style.setProperty('--palette-primary-main', currentPalette.primary.main);
      root.style.setProperty('--palette-primary-contrastText', currentPalette.primary.contrastText);
      root.style.setProperty('--palette-primary-light', currentPalette.primary.light);
      root.style.setProperty('--palette-primary-dark', currentPalette.primary.dark);
      root.style.setProperty('--palette-primary-lighter', currentPalette.primary.lighter);
      root.style.setProperty('--palette-primary-darker', currentPalette.primary.darker);

      root.style.setProperty('--palette-text-primary', currentPalette.text.primary);
      root.style.setProperty('--palette-text-secondary', currentPalette.text.secondary);
      root.style.setProperty('--palette-text-disabled', currentPalette.text.disabled);

      root.style.setProperty('--palette-background-paper', currentPalette.background.paper);
      root.style.setProperty('--palette-background-default', currentPalette.background.default);
      root.style.setProperty('--palette-background-neutral', currentPalette.background.neutral);
      root.style.setProperty(
        '--palette-background-table-header',
        currentPalette.background?.tableHeader
      );

      root.style.setProperty('--palette-action-hover', currentPalette.action.hover);
      root.style.setProperty('--palette-action-selected', currentPalette.action.selected);
      root.style.setProperty('--palette-action-disabled', currentPalette.action.disabled);
      root.style.setProperty('--palette-action-focus', currentPalette.action.focus);

      root.style.setProperty('--palette-divider', currentPalette.divider);

      root.style.setProperty('--palette-success-main', currentPalette.success.main);
      root.style.setProperty('--palette-success-contrastText', currentPalette.success.contrastText);

      root.style.setProperty('--palette-error-main', currentPalette.error.main);
      root.style.setProperty('--palette-error-contrastText', currentPalette.error.contrastText);

      root.style.setProperty('--palette-warning-main', currentPalette.warning.main);
      root.style.setProperty('--palette-warning-contrastText', currentPalette.warning.contrastText);

      root.style.setProperty('--palette-info-main', currentPalette.info.main);
      root.style.setProperty('--palette-info-contrastText', currentPalette.info.contrastText);

      // Set shadow CSS custom properties
      root.style.setProperty('--shadow-z1', currentCustomShadows.z1);
      root.style.setProperty('--shadow-z4', currentCustomShadows.z4);
      root.style.setProperty('--shadow-z8', currentCustomShadows.z8);
      root.style.setProperty('--shadow-z12', currentCustomShadows.z12);
      root.style.setProperty('--shadow-z16', currentCustomShadows.z16);
      root.style.setProperty('--shadow-z20', currentCustomShadows.z20);
      root.style.setProperty('--shadow-z24', currentCustomShadows.z24);

      root.style.setProperty('--shadow-card', currentCustomShadows.card);
      root.style.setProperty('--shadow-dropdown', currentCustomShadows.dropdown);
      root.style.setProperty('--shadow-dialog', currentCustomShadows.dialog);

      root.style.setProperty('--shadow-primary', currentCustomShadows.primary);
      root.style.setProperty('--shadow-info', currentCustomShadows.info);
      root.style.setProperty('--shadow-secondary', currentCustomShadows.secondary);
      root.style.setProperty('--shadow-success', currentCustomShadows.success);
      root.style.setProperty('--shadow-warning', currentCustomShadows.warning);
      root.style.setProperty('--shadow-error', currentCustomShadows.error);
    }
  }, [mode, primaryColor]);

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
      shadows: shadows(mode),
      customShadows: customShadows(mode, primaryColor || undefined),
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
