import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';

export const CustomCheckbox = ({ loading, ...props }) => {

  if (loading) {
    return <CircularProgress color="success" size={30} />;
  }
  return <Checkbox size="small" color="success" sx={{ pointerEvents: 'auto' }} {...props} />;
};

CustomCheckbox.propTypes = {
  loading: PropTypes.bool,
};
