import React from 'react';
import PropTypes from 'prop-types';

import { success } from 'src/theme/palette';

import { Tooltip } from 'antd';

export const CustomTooltip = ({ label, Placement, children, ...props }) => {
  // Check if label is a string or JSX
  const renderLabel = typeof label === 'string' ? <span>{label}</span> : label;

  return (
    <Tooltip
      placement={Placement}
      title={renderLabel}
      color={success?.main}
      overlayInnerStyle={{ fontSize: '16px' }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

CustomTooltip.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  Placement: PropTypes.string,
};
