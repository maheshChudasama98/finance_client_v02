import * as React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import BottomNavigation from '@mui/material/BottomNavigation';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import navConfig from './config-navigation';
// ----------------------------------------------------------------------

export default function Nav({ isActive, setIsActive }) {
  const PermissionList = useSelector((state) => state?.auth?.permissionList);
  const [filterNavItems, setFilterNavItems] = React.useState([]);

  React.useEffect(() => {    
    const filterData = navConfig.filter((item) => {
      const result = PermissionList?.find((key) => key?.ModulesName === item?.title);
      if (result?.CanRead === 1 && item.mobile) {
        return item;
      }
      return '';
    });
    setFilterNavItems(filterData);
  }, [PermissionList]);
  
  const pathname = usePathname();

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 0.5,
      }}
      elevation={24}
    >
      <BottomNavigation
        value={isActive}
        onChange={(event, newValue) => {
          setIsActive(newValue);
        }}
      >
        {filterNavItems.map((item) => {
          const active = item.path === pathname;
          return (
            <ListItemButton
              component={RouterLink}
              href={item.path}
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
                  color: 'primary.main',
                  fontWeight: 'fontWeightSemiBold',
                  // border: (theme) => `dashed 1px ${theme.palette.primary.main}`,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                  },
                }),
              }}
            >
              <Box component="span" sx={{ width: 25, height: 25, margin: 'auto', mb: 0.5 }}>
                {item.icon}
              </Box>

              <Box component="span" sx={{ textAlign: 'center' }}>
                {`${item?.title ? item?.title?.slice(0, 6) : ''}${
                  item?.title?.length > 6 ? '...' : ''
                }`}
              </Box>
            </ListItemButton>
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
