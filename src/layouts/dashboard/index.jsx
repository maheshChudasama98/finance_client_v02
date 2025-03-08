import { useState } from 'react';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import Nav from './nav';
import Main from './main';
import Header from './header';
import NavBottom from './navBottom';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const upLg = useResponsive('up', 'lg');
  // const { error, message, } = useSelector((state) => state.common);

  const [openNav, setOpenNav] = useState(false);
  const [isActive, setIsActive] = useState(true);

  return (
    <>
      <div style={{ position: "relative" }}>
        <Header onOpenNav={() => setOpenNav(true)} isActive={isActive} upLg={upLg} setIsActive={setIsActive} />
      </div>


      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} isActive={isActive} />
        <Main>{children}</Main>
      </Box>

      <Box
        sx={{
          // minHeight: 1,
          display: { xs: 'flex', md: 'none' },
          // flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <NavBottom isActive={isActive} upLg={upLg} setIsActive={setIsActive} />
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
