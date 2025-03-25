import PropTypes from 'prop-types';
import React, { useState } from 'react';

import  Select from '@mui/material/Select';
import  MenuItem from '@mui/material/MenuItem';
import  FormControl from '@mui/material/FormControl';

export const CustomSelect = ({
    defaultValue,
    label,
    field,
    menuList,
    valueKey,
    labelKey,
    required = true,
    callBackAction,
    ...props
}) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue || '');

    const handleChange = (event) => {
        const selectedId = event.target.value;
        setSelectedValue(selectedId);

        if (typeof callBackAction === 'function') {
            callBackAction(selectedId);
        }
    };

    return (
        <FormControl fullWidth>
            <Select
                value={selectedValue}
                onChange={handleChange}
                displayEmpty
                {...props}
            >
                {menuList?.map((item) => (
                    <MenuItem key={item[valueKey]} value={item[valueKey]}>
                        {item[labelKey]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

CustomSelect.propTypes = {
    defaultValue: PropTypes.string,
    label: PropTypes.string,
    field: PropTypes.string,
    menuList: PropTypes.array.isRequired,
    valueKey: PropTypes.string.isRequired,
    labelKey: PropTypes.string.isRequired,
    required: PropTypes.bool,
    callBackAction: PropTypes.func,
};
