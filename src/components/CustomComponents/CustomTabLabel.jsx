import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import tinycolor from 'tinycolor2';

const generateTabColors = (primaryColor) => {
  const colorActive = '#ffffff';
  const bgColorActive = primaryColor;

  const color = tinycolor(primaryColor).darken(25).toHexString();
  const bgColor = tinycolor(primaryColor).lighten(35).saturate(10).toHexString();

  return { color, colorActive, bgColor, bgColorActive };
};

export const CustomTabLabel = ({
  label,
  value,
  record,
  selectValue,
  primaryColor,
  defaultColor,
}) => {
  const { color, colorActive, bgColor, bgColorActive } = generateTabColors(primaryColor);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">{label}</Typography>
      {record && (
        <Box
          sx={{
            borderRadius: 0.7,
            color: selectValue === value ? colorActive : color,
            backgroundColor: selectValue === value ? bgColorActive : defaultColor || bgColor,
            paddingY: 0.2,
            paddingX: 0.8,
            marginLeft: 1,
          }}
        >
          <Typography variant="body2" fontSize={14} fontWeight={600}>
            {record}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

CustomTabLabel.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  record: PropTypes.number,
  selectValue: PropTypes.string,
  primaryColor: PropTypes.string.isRequired,
};
