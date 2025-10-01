import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { useThemeSettings } from 'src/theme';
import { setDisplayFlag } from 'src/redux/actions/common';

import Iconify from 'src/components/iconify';
import AmountVisibilityToggle from 'src/components/CustomComponents/AmountVisibilityToggle';

import { NAV, HEADER } from './config-layout';
import BranchPopover from './common/branch-popover';
import AccountPopover from './common/account-popover';
// import Searchbar from './common/searchbar';
// import LanguagePopover from './common/language-popover';
// import TransactionsPopover from './common/transactions-popover';
// import NotificationsPopover from './common/notifications-popover';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav, isActive, setIsActive }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeSettings();

  const lgUp = useResponsive('up', 'lg');
  const upLg = useResponsive('up', 'lg');

  const handleRecordClick = () => {
    navigate('/records');
    dispatch(setDisplayFlag(true));
  };

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: 'none', md: 'contents' } }}>
        <BranchPopover />
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        spacing={1}
      >
        {/* <TransactionsPopover /> */}
        {/* <NotificationsPopover /> */}
        <AmountVisibilityToggle />
        
        <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton onClick={toggleMode} color={mode === 'light' ? 'darker' : 'warning'}>
            <Iconify icon={mode === 'light' ? 'mdi:weather-night' : 'mdi:white-balance-sunny'} />
          </IconButton>
        </Tooltip>
        <Button onClick={handleRecordClick} variant="outlined" color="primary">
          Record
        </Button>
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
        background: theme.palette.background.default,
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

      {upLg && (
        <IconButton
          size="small"
          onClick={() => setIsActive(!isActive)}
          sx={{
            position: 'absolute',
            left: -16,
            top: 15,
            border: `dashed 1px ${theme.palette.divider}`,
            borderRadius: 10,
            background: theme.palette.background.default,
            // background: "#f9fafb",
            // zIndex: 999999
          }}
        >
          {isActive ? (
            <KeyboardArrowRightIcon fontSize="inherit" />
          ) : (
            <KeyboardArrowLeftIcon fontSize="inherit" />
          )}
        </IconButton>
      )}
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
  isActive: PropTypes.bool,
};
