import React from 'react';
// import 'app/styles/loader.css'

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const Loader = ({ loaderNumber }) => {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.success.main;
  if (loaderNumber === 2) {
    return (
      <Box sx={{ textAlign: 'center', p: 3, m: 'auto' }}>
        <div className="container-loader-2">
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
          <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', p: 3, m: 'auto' }}>
      <div className="spinner">
        <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
        <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
        <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
        <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
        <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
      </div>
    </Box>
  );
};
export default Loader;
