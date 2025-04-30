import { alpha } from '@mui/material/styles';

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

export const primary = {
  lighter: '#D0ECFE',
  light: '#73BAFB',
  main: '#1877F2',
  dark: '#0C44AE',
  darker: '#042174',
  contrastText: '#FFFFFF',
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
  light: '#C4CDD5',   // Lighter shade
  main: '#919EAB',    // Base color
  dark: '#637381',    // Darker shade
  darker: '#212B36',  // Darkest shade
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

const nav = {
  navColor: success?.light,
  navActiveColor: success?.light,
  navHoverColor: success?.light,
  navBgcolor: success?.light,
  navActiveBgcolor: success?.light,
  navHoverBgcolor: success?.light,
};

// ----------------------------------------------------------------------

export function palette() {
  return {
    ...base,
    ...RoleAs,
    ...nav,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: grey[100],
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };
}
