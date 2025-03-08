import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { grey } from 'src/theme/palette';

import Iconify from 'src/components/iconify';

// import Searchbar from './common/searchbar';
import { NAV, HEADER } from './config-layout';
import AccountPopover from './common/account-popover';
// import LanguagePopover from './common/language-popover';
import TransactionsPopover from './common/transactions-popover';
import NotificationsPopover from './common/notifications-popover';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav, isActive, setIsActive }) {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');
  const upLg = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <LanguagePopover /> */}
        <TransactionsPopover />
        <NotificationsPopover />
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar - 50,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${isActive ? NAV.SORT_WIDTH : NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>

      {
        upLg &&

        <IconButton
          size="small"
          onClick={() => setIsActive(!isActive)}
          sx={{
            position: "absolute",
            left: -16,
            top: 15,
            border: `dashed 1px ${theme.palette.divider}`,
            borderRadius: 10,
            background: grey[100],
            // background: "#f9fafb",
            // zIndex: 999999
          }}>

          {
            isActive ?
              <KeyboardArrowRightIcon fontSize="inherit" /> :
              <KeyboardArrowLeftIcon fontSize="inherit" />
          }
        </IconButton>
      }
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
  isActive: PropTypes.bool,
};
