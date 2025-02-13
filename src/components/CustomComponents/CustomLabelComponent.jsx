import React from 'react';
import PropTypes from 'prop-types';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const CustomLabelComponent = ({
    label,
    value,
    record,
    selectValue,
    color,
    colorActive,
    bgColor,
    bgColorActive }) => (
    <Box sx={{ display: "flex", placeItems: "center" }}>
        <Typography variant='body2' >{label}</Typography>
        <Box
            sx={{
                borderRadius: 0.7,
                color: selectValue === value ? colorActive : color,
                backgroundColor: selectValue === value ? bgColorActive : bgColor,
                paddingY: 0.2,
                paddingX: 0.8,
                marginLeft: 1
            }}>
            <Typography variant='body2' fontSize={14} fontWeight={600} >{record}</Typography>
        </Box>
    </Box>
);
CustomLabelComponent.propTypes = {
    label: PropTypes.string,
    value: PropTypes.number,
    record: PropTypes.number,
    selectValue: PropTypes.string,
    color: PropTypes.string,
    colorActive: PropTypes.string,
    bgColor: PropTypes.string,
    bgColorActive: PropTypes.string
};

