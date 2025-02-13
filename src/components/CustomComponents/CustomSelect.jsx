import PropTypes from 'prop-types';
import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { shadows } from 'src/theme/shadows';

export const CustomSelect = ({ defaultValue, label, field, menuList, valueKey, labelKey, required = true, unitType, callBackAction, ...props }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue ? menuList?.find(item => item[valueKey]) : null || null);

    const handleChange = (e, value) => {
        const selectedId = value?.[valueKey] || '';
        setSelectedValue(value);

        if (typeof callBackAction === 'function') {
            callBackAction(selectedId);
        }
    };

    return (
        <Autocomplete
            options={menuList}
            getOptionLabel={(option) => option?.[labelKey] || " "}
            value={selectedValue || null}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                />
            )}
            componentsProps={{
                popper: {
                    sx: {
                        '& .MuiAutocomplete-paper': {
                            margin: 0,
                            padding: 0,
                            boxShadow: shadows()[15],
                        },
                    },
                },
            }}
            noOptionsText="Not Data found!"
            disableClearable
            {...props}
        />
    );
};

CustomSelect.propTypes = {
    defaultValue: PropTypes.string,
    label: PropTypes.string,
    field: PropTypes.string,
    menuList: PropTypes.array,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    required: PropTypes.bool,
    unitType: PropTypes.string,
    callBackAction: PropTypes.func,
};
