import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { ImgUrl, LogoDefaultPath } from 'src/constance';

// import Link from '@mui/material/Link';
// import { useTheme } from '@mui/material/styles';

// import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, orgImg, sx, ...other }, ref) => {
  // const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;

  // const PRIMARY_MAIN = theme.palette.primary.main;

  // const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
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
        ...sx,
      }}
      {...other}
    >
      <img src={orgImg ? ImgUrl + orgImg : LogoDefaultPath} width="auto" alt="logo" />

      {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill="url(#BG1)"
            d="M362.776,196.268c0,22.057,17.945,40.002,40.002,40.002c22.057,0,40.002-17.945,40.002-40.002
	c0-16.992-10.656-31.535-25.632-37.322v-33.625c0-7.935-6.435-14.369-14.369-14.369h-68.269l-4.046-28.436h3.052
	c7.935,0,14.369-6.435,14.369-14.369V14.369C347.883,6.435,341.449,0,333.514,0H178.486c-7.935,0-14.369,6.435-14.369,14.369v53.778
	c0,7.935,6.435,14.369,14.369,14.369h3.055l-4.042,28.436h-68.277c-7.935,0-14.369,6.435-14.369,14.369v33.625
	c-14.976,5.787-25.632,20.328-25.632,37.322c0,22.057,17.945,40.002,40.002,40.002s40.002-17.945,40.002-40.002
	c0-16.992-10.656-31.535-25.632-37.322v-19.255h49.825l-39.352,276.87h-24.646c-7.935,0-14.369,6.435-14.369,14.369v66.7
	c0,7.935,6.435,14.369,14.369,14.369h293.166c7.935,0,14.369-6.435,14.369-14.369v-66.7c0-7.935-6.435-14.369-14.369-14.369h-31.403
	l-94.267-89.135l26.687-25.234c5.768-5.452,6.021-14.546,0.569-20.313c-5.453-5.771-14.548-6.024-20.313-0.569l-27.857,26.341
	l-47.507-44.92h74.97c7.935,0,14.369-6.435,14.369-14.369c0-7.935-6.435-14.369-14.369-14.369h-94.422l2.999-21.102l63.96-60.478
	l63.992,60.508l18.323,128.752c1.116,7.857,8.393,13.308,16.252,12.201c7.857-1.118,13.32-8.395,12.201-16.252l-28.17-197.929h49.81
	v19.255C373.431,164.733,362.776,179.275,362.776,196.268z M109.222,207.531c-6.21,0-11.263-5.052-11.263-11.263
	c0-6.21,5.052-11.263,11.263-11.263s11.263,5.052,11.263,11.263C120.485,202.479,115.433,207.531,109.222,207.531z M288.089,82.517
	l-32.09,30.343l-32.09-30.343C223.909,82.517,288.089,82.517,288.089,82.517z M192.856,28.739h126.289v25.039H192.856V28.739z
	 M388.213,483.261H123.787V445.3h22.748c0.006,0,0.013,0.001,0.02,0.001c0.01,0,0.02-0.001,0.03-0.001h241.628v37.961H388.213z
	 M329.353,416.561H182.646l73.353-69.361L329.353,416.561z M166.551,392.23l16.239-114.256l52.296,49.45L166.551,392.23z
	 M198.534,167.197l8.66-60.935l27.891,26.374L198.534,167.197z M276.913,132.635l27.898-26.379l8.676,60.962L276.913,132.635z
	 M402.778,207.531c-6.21,0-11.263-5.052-11.263-11.263c0-6.21,5.052-11.263,11.263-11.263c6.211,0,11.263,5.052,11.263,11.263
	C414.04,202.479,408.988,207.531,402.778,207.531z"
          />
        </g>
      </svg> */}
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
