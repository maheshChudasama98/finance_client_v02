import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { CustomTooltip } from 'src/components/CustomComponents';

import { NAV } from './config-layout';
import BranchPopover from './common/branch-popover';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav, isActive }) {
  const pathname = usePathname();
  const PermissionList = useSelector((state) => state?.auth?.permissionList);

  const [filterNavItems, setFilterNavItems] = useState([]);

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  useEffect(() => {
    //  const filterData = navConfig.filter((item) => {
    //   const result = PermissionList?.find((key) => key?.ModulesName === item?.title);
    //   if (result?.CanRead === 1) {
    //     return (item);
    //   }
    //   return '';
    // });
    const filterData = PermissionList?.filter((item) => item?.CanRead === 1);
    setFilterNavItems(filterData);
  }, [PermissionList]);

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: isActive ? 1 : 2 }}>
      <>
        <Box sx={{ display: { xs: 'block', md: 'none' }, paddingBottom: 2 }}>
          <BranchPopover />
        </Box>
        {isActive && upLg ? (
          <>
            {filterNavItems.map((item) => (
              <NavMobileItem key={item.ModulesName} item={item} />
            ))}
          </>
        ) : (
          <>
            {filterNavItems.map((item) => (
              <NavItem key={item.ModulesName} item={item} />
            ))}
          </>
        )}
      </>
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {isActive ? <Logo sx={{ m: 'auto', my: 1.5 }} /> : <Logo sx={{ ml: 3.3, my: 1.5 }} />}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: isActive ? NAV.SORT_WIDTH : NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: isActive ? NAV.SORT_WIDTH : NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  isActive: PropTypes.bool,
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.Router === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.Router}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'success.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
          },
        }),
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <i className={item?.Icon} style={{ fontSize: 18 }} />
        <Box component="span">{item.ModulesName} </Box>
      </Stack>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

// ----------------------------------------------------------------------

function NavMobileItem({ item }) {
  const pathname = usePathname();

  const active = item.Router === pathname;

  return (
    <CustomTooltip label={item?.ModulesName} Placement="rightTop">
      <ListItemButton
        component={RouterLink}
        href={item.Router}
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          fontSize: 10,
          display: 'grid',
          placeContent: 'center',
          ...(active && {
            color: 'success.main',
            fontWeight: 'fontWeightSemiBold',
            // border: (theme) => `dashed 1px ${theme.palette.success.main}`,
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 20, height: 20, margin: 'auto', mb: 0.5 }}>
          <i className={item?.Icon} style={{ fontSize: 20 }} />
          {/* {item.icon} */}
        </Box>

        <Box component="span" sx={{ textAlign: 'center' }}>
          {`${item?.ModulesName ? item?.ModulesName?.slice(0, 9) : ''}${
            item?.ModulesName?.length > 9 ? '...' : ''
          }`}
        </Box>
      </ListItemButton>
    </CustomTooltip>
  );
}

NavMobileItem.propTypes = {
  item: PropTypes.object,
};
