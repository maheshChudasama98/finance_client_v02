import { alpha, darken, lighten } from '@mui/material/styles';

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

export const brandColors = {
  // Primary Brand Color (Green)
  primary: {
    50: '#F1F8F4',
    100: '#D9F0E1',
    200: '#B8E0C7',
    300: '#8DCCAA',
    400: '#5BC43A', // main
    500: '#46A82D',
    600: '#3A8F2A',
    700: '#2F6E22',
    800: '#23501A',
    900: '#183813',
  },

  // Secondary Accent (Blue)
  secondary: {
    50: '#F0F6FE',
    100: '#D6E6FD',
    200: '#ADCDFB',
    300: '#73BAFB',
    400: '#1877F2', // main
    500: '#125BCC',
    600: '#0C44AE',
    700: '#083285',
    800: '#05225C',
    900: '#031536',
  },

  // Supportive Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // main
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // main
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // main
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // main
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373', // main
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

export const primary = {
  lighter: '#C8FAD0',
  light: '#7BE86B',
  main: '#5BC43A',
  dark: '#3A8F2A',
  darker: '#1F5A18',
  contrastText: '#FFFFFF',
};

export const primary2 = {
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
  lighter: '#292b2bff',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

export const darker = {
  lighter: '#F4F6F8',
  light: '#C4CDD5',
  main: '#919EAB',
  dark: '#637381',
  darker: '#212B36',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#C8FAD0',
  light: '#7BE86B',
  main: '#5BC43A',
  dark: '#3A8F2A',
  darker: '#1F5A18',
  contrastText: '#FFFFFF',
};

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

const backgroundVariants = (isLight) => ({
  red: {
    lighter: isLight ? '#FFE9D5' : '#7A0916',
    light: isLight ? '#FFAC82' : '#B71D18',
    main: isLight ? '#FF5630' : '#FFAC82',
    dark: isLight ? '#B71D18' : '#FFAC82',
  },

  blue: {
    lighter: isLight ? '#D0ECFE' : '#042174',
    light: isLight ? '#73BAFB' : '#0C44AE',
    main: isLight ? '#1877F2' : '#73BAFB',
    dark: isLight ? '#0C44AE' : '#1877F2',
  },

  green: {
    lighter: isLight ? '#C8FAD0' : '#1F5A18',
    light: isLight ? '#7BE86B' : '#3A8F2A',
    main: isLight ? '#5BC43A' : '#7BE86B',
    dark: isLight ? '#3A8F2A' : '#5BC43A',
  },

  purple: {
    lighter: isLight ? '#EFD6FF' : '#27097A',
    light: isLight ? '#C684FF' : '#5119B7',
    main: isLight ? '#8E33FF' : '#C684FF',
    dark: isLight ? '#5119B7' : '#8E33FF',
  },
});

const gradientVariants = (isLight) => ({
  primary: !isLight
    ? `linear-gradient(25deg, ${brandColors.primary[200]} 0%, ${grey[0]} 100%)`
    : `linear-gradient(25deg, ${brandColors.primary[900]} 0%, ${grey[900]} 100%)`,

  secondary: isLight
    ? `linear-gradient(25deg, ${brandColors.secondary[200]} 0%, ${grey[0]} 100%)`
    : `linear-gradient(25deg, ${brandColors.secondary[600]} 0%, ${grey[900]} 100%)`,

  success: isLight
    ? `linear-gradient(25deg, ${brandColors.success[200]} 0%, ${grey[0]} 100%)`
    : `linear-gradient(25deg, ${brandColors.success[900]} 0%, ${grey[900]} 100%)`,

  warning: isLight
    ? `linear-gradient(25deg, ${brandColors.warning[100]} 0%, ${grey[0]} 100%)`
    : `linear-gradient(25deg, ${brandColors.warning[900]} 0%, ${grey[900]} 100%)`,

  error: isLight
    ? `linear-gradient(25deg, ${brandColors.error[200]} 0%, ${grey[0]} 100%)`
    : `linear-gradient(25deg, ${brandColors.error[900]} 0%, ${grey[900]} 100%)`,

  info: isLight
    ? `linear-gradient(25deg, ${brandColors.info[100]} 0%, ${grey[0]} 100%)`
    : `linear-gradient(25deg, ${brandColors.info[900]} 0%, ${grey[900]} 100%)`,

  neutral: isLight
    ? `linear-gradient(25deg, ${brandColors.neutral[200]} 0%, ${grey[0]} 100%)`
    : `linear-gradient(25deg, ${brandColors.neutral[900]} 0%, ${grey[900]} 100%)`,
});

const borderVariants = (isLight) => ({
  default: isLight ? '#E5E7EB' : '#374151',
  subtle: isLight ? '#F3F4F6' : '#1F2937',
  strong: isLight ? '#9CA3AF' : '#6B7280',

  primary: isLight ? brandColors.primary[100] : brandColors.primary[900],
  secondary: isLight ? brandColors.secondary[200] : brandColors.secondary[600],
  success: isLight ? brandColors.success[100] : brandColors.success[900],
  warning: isLight ? brandColors.warning[100] : brandColors.warning[900],
  error: isLight ? brandColors.error[100] : brandColors.error[900],
  info: isLight ? brandColors.info[100] : brandColors.info[900],
});

function normalizeHex(hex) {
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    return h
      .split('')
      .map((c) => c + c)
      .join('');
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
    contrastText2: getContrastText(main),
    contrastText:'#FFFFFF'  ,
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
  // const computedSuccess = primaryColor ? { ...success, main: computedPrimary.main } : success;
  const computedSuccess = primaryColor ? success : success;

  return {
    ...base,
    primary: computedPrimary,
    success: computedSuccess,

    ...navBase,

    navColor: computedSuccess.main,
    navActiveColor: computedSuccess.main,
    navHoverColor: computedSuccess.main,
    navBgcolor: alpha(computedSuccess.main, 0.08),
    navActiveBgcolor: alpha(computedSuccess.main, 0.16),
    navHoverBgcolor: alpha(computedSuccess.main, 0.12),
    mode,
    text: {
      success: computedSuccess?.main,
      primarytext: computedPrimary?.main,
      primary: isLight ? grey[800] : grey[0],
      secondary: isLight ? grey[600] : grey[400],
      disabled: grey[500],
    },
    background: {
      paper: isLight ? grey[0] : grey[900],
      default: isLight ? grey[100] : grey[800],
      neutral: isLight ? grey[100] : grey[700],
      neutral2: isLight ? grey[200] : grey[700],
      textbox: isLight ? grey[200] : grey[800],
      tableHeader: isLight ? grey[200] : grey[700],
      ...backgroundVariants(isLight),
    },
    border: borderVariants(isLight),
    gradients: gradientVariants(isLight),
    action: {
      ...base.action,
      active: isLight ? grey[600] : grey[400],
    },
  };
}
