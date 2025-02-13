import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'antd';

export const CustomTooltip = ({ label, Placement, children, ...props }) => (
    <Tooltip
        placement={Placement}
        title={label}
        color='green'
        overlayInnerStyle={{ fontSize: '16px' }}
        {...props}  >
        {children}
    </Tooltip>
);


CustomTooltip.propTypes = {
    label: PropTypes.string,
    Placement: PropTypes.string,
}


