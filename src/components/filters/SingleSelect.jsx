import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete';

export const SingleSelect = ({ label, menuList, valueKey, labelKey, callBackAction, onInputChange, ...props }) => {

    const handleChange = (newValue, value) => {
        callBackAction(value[valueKey]);
    };

    const handleInputChange = (event, newInputValue) => {
        if (onInputChange) {
            onInputChange(newInputValue); // Call the action that triggers the API call
        }
    };

    return (
        <Autocomplete
            fullWidth
            size='small'
            id={label}
            name={label}
            options={menuList}
            getOptionLabel={(option) => option?.[labelKey] || " "}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    // label={t(label)}
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        'aria-label': 'Without label',
                    }}
                />
            )}
            onInputChange={handleInputChange}
            noOptionsText='Not Data found!'
            disableClearable
            {...props}
        />
    );
};

SingleSelect.propTypes = {
    label: PropTypes.string,
    field: PropTypes.string,
    menuList: PropTypes.array,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    callBackAction: PropTypes.func,
}


