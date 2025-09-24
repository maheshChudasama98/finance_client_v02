import { alpha, darken, lighten } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  10: '#FaFaFa',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  1000: '#000000',
};

export const green = {
  100: '#05a972',
};

export const RoleAs = {
  Staff: '#0fa4ba',
  Contractor: '#BA68C8',
  JuniorEngineer: '#01369e',
  SuperAdmin: '#F47373',
};

export const tabsColors = {
  all: '#637381',
  allActive: '#ffffff',

  allBg: '#edeff1',
  allBgActive: '#000000',

  panding: '#b76e00',
  pandingActive: '#000000',
  pandingBg: '#fff1d6',
  pandingBgActive: '#ffab00',

  completed: '#118d57',
  completedActive: '#ffffff',
  completedBg: '#dbf6e5',
  completedBgActive: '#22c55e',

  cancelled: '#b71d18',
  cancelledActive: '#ffffff',
  cancelledBg: '#ffe4de',
  cancelledBgActive: '#ff5630',
};

// export const primary = {
// lighter: '#D0ECFE',
// light: '#73BAFB',
// main: '#1877F2',
// dark: '#0C44AE',
// darker: '#042174',
// contrastText: '#FFFFFF',
// };

export const primary = {
  lighter: '#C8FAD0', // Lightest shade
  light: '#7BE86B', // Lighter shade
  main: '#5BC43A', // Base color
  dark: '#3A8F2A', // Darker shade
  darker: '#1F5A18', // Darkest shade
  contrastText: '#FFFFFF', // Contrast text color
};

export const secondary = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};
export const success = {
  lighter: '#C8FAD0', // Lightest shade
  light: '#7BE86B', // Lighter shade
  main: '#5BC43A', // Base color
  dark: '#3A8F2A', // Darker shade
  darker: '#1F5A18', // Darkest shade
  contrastText: '#FFFFFF', // Contrast text color
};

export const darker = {
  lighter: '#F4F6F8', // Lightest shade
  light: '#C4CDD5', // Lighter shade
  main: '#919EAB', // Base color
  dark: '#637381', // Darker shade
  darker: '#212B36', // Darkest shade
  contrastText: '#FFFFFF', // Contrast text color
};


// export const success = {
//   lighter: '#C8FAD6',
//   light: '#5BE49B',
//   main: '#00A76F',
//   dark: '#007867',
//   darker: '#004B50',
//   contrastText: '#FFFFFF',
// };

export const warning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const CancelButton = {
  main: grey[700],
};

export const common = {
  main: '#000000',
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

function normalizeHex(hex) {
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    return h.split('').map((c) => c + c).join('');
  }
  return h.padEnd(6, '0').slice(0, 6);
}

function hexToRgb(hex) {
  const h = normalizeHex(hex);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function getContrastText(hex) {
  try {
    const { r, g, b } = hexToRgb(hex);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  } catch (e) {
    return '#FFFFFF';
  }
}

function buildPrimaryScale(base) {
  const main = base;
  return {
    lighter: lighten(main, 0.52),
    light: lighten(main, 0.28),
    main,
    dark: darken(main, 0.18),
    darker: darken(main, 0.32),
    contrastText: getContrastText(main),
  };
}

const base = {
  primary,
  secondary,
  info,
  success,
  darker,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
  CancelButton,
};

const navBase = {
  navColor: success?.light,
  navActiveColor: success?.light,
  navHoverColor: success?.light,
  navBgcolor: success?.light,
  navActiveBgcolor: success?.light,
  navHoverBgcolor: success?.light,
};

// ----------------------------------------------------------------------

export function palette(mode = 'light', primaryColor) {
  const isLight = mode === 'light';

  const computedPrimary = primaryColor ? buildPrimaryScale(primaryColor) : primary;
  const computedSuccess = primaryColor
    ? { ...success, main: computedPrimary.main }
    : success;

  return {
    ...base,
    primary: computedPrimary,
    success: computedSuccess,
    ...RoleAs,
    ...navBase,
    // override nav colors with selected brand color
    navColor: computedSuccess.main,
    navActiveColor: computedSuccess.main,
    navHoverColor: computedSuccess.main,
    navBgcolor: alpha(computedSuccess.main, 0.08),
    navActiveBgcolor: alpha(computedSuccess.main, 0.16),
    navHoverBgcolor: alpha(computedSuccess.main, 0.12),
    mode,
    text: {
      success: computedSuccess?.main,
      primary: isLight ? grey[800] : '#FFFFFF',
      secondary: isLight ? grey[600] : grey[400],
      disabled: grey[500],
    },
    background: {
      paper: isLight ? '#FFFFFF' : grey[900],
      default: isLight ? grey[100] : grey[800],
      neutral: isLight ? '#E5E7EB' : grey[700],
    },
    action: {
      ...base.action,
      active: isLight ? grey[600] : grey[400],
    },
  };
}
