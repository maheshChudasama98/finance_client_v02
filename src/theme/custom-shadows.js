import { alpha } from '@mui/material/styles';

import { grey, info, error, common, primary, success, warning, secondary } from './palette';

// ----------------------------------------------------------------------

export function customShadows(mode = 'light', primaryColor) {
  const isLight = mode === 'light';

  // Use different shadow colors for light and dark modes
  const shadowColor = isLight ? grey[500] : grey[900];
  const transparent = alpha(shadowColor, isLight ? 0.16 : 0.25);

  // Use dynamic primary color if provided
  const computedPrimary = primaryColor || primary.main;
  const computedSuccess = primaryColor || success.main;
  const computedInfo = info.main;
  const computedSecondary = secondary.main;
  const computedWarning = warning.main;
  const computedError = error.main;

  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z4: `0 4px 8px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    //
    // card: `0 0 2px 0 ${alpha(shadowColor, isLight ? 0.08 : 0.15)}, 0 12px 24px -4px ${alpha(shadowColor, isLight ? 0.08 : 0.15)}`,
    card: `0px 3px 5px -1px ${transparent},0px 5px 8px 0px ${transparent},0px 1px 14px 0px ${transparent}`,
    dropdown: `0 0 2px 0 ${alpha(shadowColor, isLight ? 0.24 : 0.35)}, -20px 20px 40px -4px ${alpha(
      shadowColor,
      isLight ? 0.24 : 0.35
    )}`,
    dialog: `-40px 40px 80px -8px ${alpha(common.black, isLight ? 0.24 : 0.45)}`,
    //
    primary: `0 8px 16px 0 ${alpha(computedPrimary, isLight ? 0.24 : 0.35)}`,
    info: `0 8px 16px 0 ${alpha(computedInfo, isLight ? 0.24 : 0.35)}`,
    secondary: `0 8px 16px 0 ${alpha(computedSecondary, isLight ? 0.24 : 0.35)}`,
    success: `0 8px 16px 0 ${alpha(computedSuccess, isLight ? 0.24 : 0.35)}`,
    warning: `0 8px 16px 0 ${alpha(computedWarning, isLight ? 0.24 : 0.35)}`,
    error: `0 8px 16px 0 ${alpha(computedError, isLight ? 0.24 : 0.35)}`,
  };
}
