import * as React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import BottomNavigation from '@mui/material/BottomNavigation';
// import IconButton from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

export default function Nav({ isActive, setIsActive }) {
  const PermissionList = useSelector((state) => state?.auth?.permissionList);
  const [filterNavItems, setFilterNavItems] = React.useState([]);
  const scrollRef = React.useRef(null);
  // const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  // const [canScrollRight, setCanScrollRight] = React.useState(false);

  React.useEffect(() => {
    const filterData = PermissionList?.filter((item) => item?.CanRead === 1 && item?.isMovie === 1);    
    setFilterNavItems(filterData);
  }, [PermissionList]);

  const pathname = usePathname();

  // Handle scroll visibility
  // const checkScroll = () => {
  //   if (scrollRef.current) {
  //     setCanScrollLeft(scrollRef.current.scrollLeft > 0);
  //     setCanScrollRight(
  //       scrollRef.current.scrollLeft + scrollRef.current.clientWidth < scrollRef.current.scrollWidth
  //     );
  //   }
  // };

  // Scroll to the left
  // const handleScrollLeft = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  //   }
  // };

  // Scroll to the right
  // const handleScrollRight = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  //   }
  // };

  React.useEffect(() => {
    // checkScroll();
    // scrollRef.current?.addEventListener('scroll', checkScroll);
    // return () => scrollRef.current?.removeEventListener('scroll', checkScroll);
  }, []);

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
      {/* Left Scroll Button */}
      {/* {canScrollLeft && (
        <i
          className="fa-solid fa-caret-left"
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            bgcolor: 'background.paper',
            boxShadow: 1,
            fontSize: 30,
          }}
          onClick={handleScrollLeft}
        />
      )} */}

      {/* Bottom Navigation */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar for Chrome, Safari
          },
        }}
      >
        <BottomNavigation
          value={isActive}
          onChange={(event, newValue) => {
            setIsActive(newValue);
          }}
          sx={{
            display: 'flex',
            flexShrink: 0,
          }}
        >
          {filterNavItems.map((item) => {
            const active = item.Router === pathname;
            return (
              <ListItemButton
                component={RouterLink}
                href={item.Router}
                key={item.Router}
                sx={{
                  minHeight: 44,
                  borderRadius: 0.75,
                  typography: 'body2',
                  color: 'text.secondary',
                  textTransform: 'capitalize',
                  fontWeight: 'fontWeightMedium',
                  fontSize: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 80,
                  ...(active && {
                    color: 'primary.main',
                    fontWeight: 'fontWeightSemiBold',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    },
                  }),
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 25,
                    height: 25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 0.5,
                  }}
                >
                  <i className={item?.Icon} style={{ fontSize: 18 }} />
                </Box>
                <Box component="span" sx={{ textAlign: 'center' }}>
                  {`${item?.ModulesName ? item?.ModulesName?.slice(0, 6) : ''}${
                    item?.ModulesName?.length > 6 ? '...' : ''
                  }`}
                </Box>
              </ListItemButton>
            );
          })}
        </BottomNavigation>
      </Box>

      {/* Right Scroll Button */}
      {/* {
        canScrollRight && (
          <Box>
            <i
              className="fa-solid fa-caret-right"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'background.paper',
                boxShadow: 1,
                fontSize: 30,
              }}
              onClick={handleScrollRight}
            />
          </Box>
        )
        // <IconButton
        //   onClick={handleScrollRight}
        //   sx={{
        //     position: 'absolute',
        //     right: 0,
        //     top: '50%',
        //     transform: 'translateY(-50%)',
        //     zIndex: 10,
        //     bgcolor: 'background.paper',
        //     boxShadow: 1,
        //   }}
        // >
        // <i class="fa-solid fa-caret-left"></i>
        // </IconButton>
      } */}
    </Paper>
  );
}
