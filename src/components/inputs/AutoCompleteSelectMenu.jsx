import React from 'react'
import PropTypes from 'prop-types'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { shadows } from 'src/theme/shadows';

export const AutoCompleteSelectMenu = ({ formik, label, field, menuList, valueKey, labelKey, required = true, unitType, callBackAction, ...props }) => {

    const handleChange = (e, value) => {
        const selectedPesticideId = value?.[valueKey] || '';
        formik.setFieldValue(field, selectedPesticideId);

        if (typeof callBackAction === 'function') {
            callBackAction(selectedPesticideId);
        }
    };

    return (
        <Autocomplete
            fullWidth
            id={field}
            name={field}
            options={menuList}
            getOptionLabel={(option) => option?.[labelKey] || " "}
            value={menuList.find((option) => option[valueKey] === formik.values[field]) || null}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    // label={t(label)}
                    required={required}
                    onBlur={formik.handleBlur}
                    error={formik.touched[field] && Boolean(formik.errors[field])}
                    // helperText={formik.touched[field] && formik.errors[field] ? t(formik.errors[field]) : ""
                    helperText={formik.touched[field] && formik.errors[field] ? formik.errors[field] : ""
                    }
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                                {unitType && (
                                    <InputAdornment position="end">
                                        {unitType}
                                    </InputAdornment>
                                )}
                            </>
                        ),
                    }}
                />
            )}
            sx={{
                '& .MuiInputLabel-asterisk': {
                    color: 'red', fontSize: 18,
                },
            }}
            componentsProps={{
                popper: {
                    sx: {
                        '& .MuiAutocomplete-paper': {
                            boxShadow: shadows()[10],
                        },
                    },
                },
            }}
            // noOptionsText={t('Not Data found!')}
            noOptionsText='Not Data found!'
            disableClearable
            {...props}
        />
    )
}

AutoCompleteSelectMenu.propTypes = {
    formik: PropTypes.object,
    label: PropTypes.string,
    field: PropTypes.string,
    menuList: PropTypes.array,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    required: PropTypes.bool,
    unitType: PropTypes.string,
    callBackAction: PropTypes.func,
}
