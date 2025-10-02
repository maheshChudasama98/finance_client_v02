import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';

// import { ImgUrl, LogoDefaultPath } from 'src/constance';

// import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

// import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, orgImg, sx, ...other }, ref) => {
  const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg"
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 50,
        height: 50,
        display: 'inline-flex',
        // mb: 2,
        ...sx,
      }}
      {...other}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="5.0em" height="5.0em" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="WALLET_ICON" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <path
          fill="url(#WALLET_ICON)"
          d="M16 6H3.5v-.5l11-.88v.88H16V4c0-1.1-.891-1.872-1.979-1.717L3.98 3.717C2.891 3.873 2 4.9 2 6v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-1.5 7.006a1.5 1.5 0 1 1 .001-3.001a1.5 1.5 0 0 1-.001 3.001"
        />
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return logo;
  // <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
  // </Link >
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
  orgImg: PropTypes.string,
};

export default Logo;
